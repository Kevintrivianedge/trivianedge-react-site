# Security Monitoring & Alerting Guide

## Overview

Phase 4 of the security implementation introduces comprehensive real-time monitoring and alerting infrastructure. This guide explains how to configure, deploy, and operate the security monitoring system.

## Architecture

The security monitoring system consists of three components:

1. **Event Detection**: Real-time tracking of security events (failed auth, rate limiting)
2. **Threshold Checking**: Aggregation of events over time windows (1-minute buckets)
3. **Alert Distribution**: Webhook-based notifications to Slack, Discord, or custom endpoints
4. **Health Monitoring**: Admin-only API endpoint for dashboard integration

## Configuration

### Environment Variables

Set these in Cloudflare Workers secrets:

```bash
# Required: Slack/Discord webhook URL for critical security alerts
wrangler secret put SECURITY_ALERT_WEBHOOK_URL
# Example: https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Optional: Custom threshold for failed auth alerts (default: 10 per minute)
wrangler secret put SECURITY_ALERT_THRESHOLD_FAILED_AUTH
# Example: 10 (or 15, 20, etc.)

# Optional: Daily health check webhook URL
wrangler secret put HEALTH_CHECK_WEBHOOK_URL
# Example: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Webhook Setup

#### Slack Incoming Webhook

1. Go to your Slack workspace → Settings & administration → Manage apps
2. Search for "Incoming Webhooks" and install
3. Click "Create New Webhook"
4. Select target channel (e.g., #security)
5. Copy webhook URL to `SECURITY_ALERT_WEBHOOK_URL`

#### Discord Webhook

1. Go to your Discord server → Server Settings → Integrations → Webhooks
2. Click "New Webhook"
3. Name it (e.g., "Security Alerts")
4. Copy webhook URL to `SECURITY_ALERT_WEBHOOK_URL`

## Alert Types

### Brute Force Detection

**Event**: `brute_force_attempt_detected`

**Trigger Conditions**:
- High severity: Failed auth attempts ≥ threshold (default 10/min)
- Critical severity: Failed auth attempts ≥ 2× threshold (default 20/min)

**Example Alert (Slack)**:

```
🚨 HIGH: High volume of failed authentication attempts (12)

Event: brute_force_attempt_detected
Severity: high
Time: 2026-09-10T17:30:00Z

Detected 12 failed authentication attempts in the last minute. This may indicate a brute force attack.

Action Required: Monitor the situation. Increase logging if it continues.
```

**Metrics Included**:
- `failed_attempts`: Total count in 1-minute window
- `threshold`: Configured threshold value
- `window_ms`: Aggregation window (60,000 ms)

## API Endpoints

### `/api/security/health` (Admin-Only)

Returns current security status and metrics.

**Authentication**: Required (admin API token)

**Method**: GET

**Response Format**:

```json
{
  "success": true,
  "health": {
    "status": "healthy|warning|critical",
    "timestamp": "2026-09-10T17:30:00Z",
    "security_metrics": {
      "failed_auth_attempts_1min": 3,
      "failed_auth_threshold": 10,
      "rate_limited_ips": 2,
      "signature_failures": 0,
      "recent_failed_auth_events": 3
    },
    "alerts_active": false,
    "recommendation": "System operating normally"
  }
}
```

**Status Levels**:

| Status | Condition | Action |
|--------|-----------|--------|
| healthy | failed_auth < threshold | No action needed |
| warning | failed_auth ≥ threshold | Monitor and log |
| critical | failed_auth ≥ 2× threshold | Immediate investigation |

**Example Usage**:

```bash
curl -X GET https://api.trivianedge.com/api/security/health \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Monitoring Dashboard Integration

### Grafana/DataDog/New Relic

1. Create a data source that calls `/api/security/health` every 60 seconds
2. Display the following metrics:
   - `security_metrics.failed_auth_attempts_1min` (gauge)
   - `security_metrics.rate_limited_ips` (gauge)
   - Health status (categorical)
3. Set up alerts:
   - Alert when `status == 'warning'`
   - Alert when `status == 'critical'` (with page/escalation)

### Example Query (Prometheus-compatible):

```promql
# Sample query for monitoring dashboard
security_failed_auth_attempts_1min{job="api"}

# Alert rule example:
alert: SecurityHealthWarning
expr: security_health_status == 1  # warning
for: 5m
annotations:
  summary: "Security system in warning state"
```

## Operational Runbooks

### Responding to High Alert

**Severity: High (1-2× threshold)**

1. Check `/api/security/health` to get current metrics
2. Review admin auth logs in KV storage:
   ```
   Prefix: admin_auth_failed:*
   Prefix: admin_auth_rate_limited:*
   ```
3. Identify attacking IP addresses (anonymized to /24 for IPv4, ::/64 for IPv6)
4. Assess impact:
   - Is this legitimate traffic (login attempt storms)?
   - Is this an attack (credential guessing)?
5. Actions:
   - Increase logging verbosity
   - Notify security team
   - Monitor for escalation to critical

### Responding to Critical Alert

**Severity: Critical (≥ 2× threshold)**

1. **Immediate**: Page security team on-call
2. Review `/api/security/health` endpoint
3. Extract attacking IP from recent auth failures:
   ```javascript
   // Query KV for recent failed auth events
   const prefix = 'admin_auth_failed:';
   const events = await env.ANALYTICS_KV.list({ prefix, limit: 100 });
   ```
4. Consider temporary IP blocking:
   - Add Cloudflare Firewall Rule to block identified IP(s)
   - Rule: `(ip.src in {attacking_ip}) -> Block`
   - Set time limit (e.g., 1 hour)
5. Investigate root cause:
   - Is there a leaked admin token?
   - Is there a vulnerability enabling credential guessing?
   - Are they targeting specific endpoints?
6. Response actions:
   - If token leaked: Rotate admin API token immediately
   - If vulnerability: Deploy security fix
   - Post-incident: Review and adjust thresholds
7. Document in incident log with:
   - Time of first alert
   - IPs involved
   - Response actions taken
   - Root cause analysis
   - Preventive measures

## Threshold Configuration

The default threshold of 10 failed auth attempts/minute is calibrated for:
- Detecting genuine brute force attempts (>5 attempts/min is unusual)
- Avoiding false positives from legitimate users with password issues
- Allowing time for manual response before escalation to critical

### Adjusting Thresholds

If you experience false positives:

```bash
# Increase to 20 attempts/minute
wrangler secret put SECURITY_ALERT_THRESHOLD_FAILED_AUTH
# Enter: 20
```

If detection is too slow (attacks escalate before alert):

```bash
# Decrease to 5 attempts/minute
wrangler secret put SECURITY_ALERT_THRESHOLD_FAILED_AUTH
# Enter: 5
```

**Recommended values by environment**:
- Production: 10 (default)
- Staging: 5 (detect faster)
- Development: 20 (allow testing)

## Metrics Collection

### Failed Authentication Events

**KV Prefix**: `admin_auth_failed:{timestamp}:{uuid}`

**Event Format**:

```json
{
  "ip": "203.0.113.0",
  "reason": "invalid_token",
  "timestamp": "2026-09-10T17:30:00Z",
  "token_version": "v1"
}
```

### Rate Limited Events

**KV Prefix**: `admin_auth_rate_limited:{timestamp}:{uuid}`

**Event Format**:

```json
{
  "ip": "203.0.113.0",
  "attempts": 6,
  "limit": 5,
  "timestamp": "2026-09-10T17:30:00Z"
}
```

### Signature Verification Failures

**KV Prefix**: `admin_auth_signature_failed:{timestamp}:{uuid}`

**Event Format**:

```json
{
  "ip": "203.0.113.0",
  "reason": "timestamp_expired",
  "timestamp": "2026-09-10T17:30:00Z"
}
```

### Security Alerts Sent

**KV Prefix**: `security_alert_sent:{timestamp}:{uuid}`

**Event Format**:

```json
{
  "alert_type": "brute_force_attempt",
  "severity": "high",
  "details": {
    "failed_attempts": 12,
    "threshold": 10,
    "window_ms": 60000
  },
  "timestamp": "2026-09-10T17:30:00Z"
}
```

## Deployment Steps

### Pre-Deployment

1. Set up Slack/Discord incoming webhook
2. Test webhook with curl:
   ```bash
   curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
     -H 'Content-type: application/json' \
     -d '{"text":"Test message from TrivianEdge security system"}'
   ```
3. Verify admin API token is configured in production Cloudflare settings
4. Review threshold settings (default 10 is recommended)

### Deployment

1. Deploy worker code with Phase 4 changes
2. Verify `/api/security/health` endpoint returns 200 with valid auth
3. Run manual test:
   ```bash
   # Make 11 failed auth attempts to trigger alert
   for i in {1..11}; do
     curl -X GET https://api.trivianedge.com/api/admin/venture-stats \
       -H "X-Admin-Token: invalid_token_$i"
   done
   
   # Verify alert appears in Slack/Discord within 60 seconds
   ```
4. Verify webhook delivery (check Slack/Discord for test alert)
5. Check `/api/security/health` to see metrics reflected

### Post-Deployment

1. Monitor alert channel for false positives (first 24 hours)
2. Adjust threshold if needed:
   - Too many alerts: Increase threshold
   - Alerts not firing: Decrease threshold
3. Add monitoring dashboard queries
4. Document in runbook
5. Train security team on alert response procedures

## Troubleshooting

### Alerts Not Firing

**Check 1**: Webhook URL configured
```bash
# Verify in Cloudflare dashboard
wrangler secret list | grep SECURITY_ALERT_WEBHOOK_URL
```

**Check 2**: Threshold setting
```bash
# Current default is 10 if not set
# Set explicitly if unsure:
wrangler secret put SECURITY_ALERT_THRESHOLD_FAILED_AUTH
# Enter: 10
```

**Check 3**: Event generation
```bash
# Try triggering failed auth attempts
curl -X GET https://api.trivianedge.com/api/admin/venture-stats \
  -H "X-Admin-Token: definitely_invalid"
```

**Check 4**: Webhook connectivity
- Verify webhook URL is correct (no typos)
- Test manually with curl
- Check Slack/Discord logs for webhook errors

### Too Many False Alerts

**Solution 1**: Increase threshold
```bash
# If getting alerts at 5 failed attempts:
wrangler secret put SECURITY_ALERT_THRESHOLD_FAILED_AUTH
# Enter: 15
```

**Solution 2**: Reduce alert frequency
- Current design alerts once per threshold crossing
- Future: Consider rate-limiting alerts (max 1 per minute)

### Health Check Returns Errors

**Error: "ANALYTICS_KV not available"**
- Verify KV namespace binding in wrangler.toml
- Confirm KV namespace exists in Cloudflare dashboard

**Error: "Unauthorized"**
- Verify admin API token in request header
- Check token hasn't expired (if expiration implemented)

## Future Enhancements

### Planned Features

1. **Daily Health Summaries**
   - Send daily report to HEALTH_CHECK_WEBHOOK_URL
   - Include metrics, trends, recommendations

2. **Anomaly Detection**
   - Machine learning-based pattern detection
   - Alert on unusual geographic patterns
   - Alert on unusual request timing

3. **Custom Alert Actions**
   - Automatic IP blocking via Cloudflare API
   - Automatic token rotation on detection
   - Automatic incident ticket creation

4. **Metrics Retention & Analytics**
   - Extended metrics storage (currently 180 days)
   - Time-series analysis of alert patterns
   - Dashboard integration with Grafana/Datadog

5. **Multi-Channel Alerts**
   - Email alerts for critical severity
   - SMS/PagerDuty integration
   - Custom webhook formats

## API Reference

### Security Alert Object

```typescript
type SecurityAlert = {
  severity: 'critical' | 'high' | 'medium' | 'low';
  event_type: string;
  title: string;
  description: string;
  details: Record<string, unknown>;
  timestamp: string;
  action_required?: string;
};
```

### Security Health Object

```typescript
type SecurityHealth = {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  security_metrics: {
    failed_auth_attempts_1min: number;
    failed_auth_threshold: number;
    rate_limited_ips: number;
    signature_failures: number;
    recent_failed_auth_events: number;
  };
  alerts_active: boolean;
  recommendation: string;
};
```

## Support & Questions

For issues or questions:
1. Check troubleshooting section above
2. Review worker logs in Cloudflare dashboard
3. Check KV storage for event records
4. Contact security team with:
   - `/api/security/health` output
   - Recent failed auth events (from KV)
   - Webhook delivery logs (from Slack/Discord)
