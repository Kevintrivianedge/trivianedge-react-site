import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export type SecurityStatus = 'secure' | 'warning' | 'critical' | 'unknown';

interface SecurityStatusIndicatorProps {
  status?: SecurityStatus;
  showDetails?: boolean;
  className?: string;
}

/**
 * Security Status Indicator Component
 * Displays current security status based on health check endpoint
 * Shows visual indicator (icon + color) and optional details
 */
const SecurityStatusIndicator: React.FC<SecurityStatusIndicatorProps> = ({
  status = 'unknown',
  showDetails = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [healthData, setHealthData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDetails && isExpanded) {
      fetchHealthStatus();
    }
  }, [isExpanded, showDetails]);

  const fetchHealthStatus = async () => {
    setLoading(true);
    try {
      const adminToken = typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem('admin_token_default')
        : null;

      if (!adminToken) {
        setHealthData({ error: 'Admin token not available' });
        return;
      }

      const response = await fetch('/api/security/health', {
        headers: { 'X-Admin-Token': adminToken },
      });

      if (response.ok) {
        const data = await response.json() as { success?: boolean; health?: Record<string, unknown> };
        setHealthData(data?.health || null);
      }
    } catch (error) {
      setHealthData({ error: error instanceof Error ? error.message : 'Failed to fetch health status' });
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    secure: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      label: 'Secure',
      description: 'All security systems operating normally',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      label: 'Security Warning',
      description: 'Unusual activity detected, monitor closely',
    },
    critical: {
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      label: 'Critical Alert',
      description: 'Security incident in progress, immediate action required',
    },
    unknown: {
      icon: Shield,
      color: 'text-muted',
      bgColor: 'bg-muted/5',
      label: 'Status Unknown',
      description: 'Security status not available',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${className}`}>
      <button
        onClick={() => showDetails && setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${config.bgColor} ${
          showDetails ? 'cursor-pointer hover:opacity-80' : ''
        }`}
        type="button"
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
      </button>

      {isExpanded && showDetails && (
        <div className="mt-2 p-3 rounded-lg border border-border bg-background/50 space-y-2">
          {loading && <p className="text-xs text-muted">Loading security status...</p>}

          {!loading && healthData && (
            <>
              <p className="text-xs text-muted">{config.description}</p>

              {healthData.security_metrics && typeof healthData.security_metrics === 'object' && (
                <div className="text-xs space-y-1 mt-2 pt-2 border-t border-border">
                  {Object.entries(healthData.security_metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted">{formatLabel(key)}:</span>
                      <span className="font-semibold text-text">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {healthData.recommendation && (
                <p className="text-xs text-muted italic mt-2 pt-2 border-t border-border">
                  {String(healthData.recommendation)}
                </p>
              )}
            </>
          )}

          {!loading && !healthData && (
            <p className="text-xs text-muted">Unable to load security status</p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Format metric key to human-readable label
 */
function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default SecurityStatusIndicator;
