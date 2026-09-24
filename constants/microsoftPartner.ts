// Single source of truth for the Microsoft partnership claim and cloud metrics.
// Everything here renders publicly, so only fill in figures you can back up.
// Any metric left as null is hidden; panels fall back to capability rows.

export interface PartnerMetric {
  label: string;
  /** Display value, e.g. "1,200+". null hides the row. */
  value: string | null;
  /** 0–100 for the bar fill; omit for no bar. */
  fill?: number;
}

export const MICROSOFT_PARTNER = {
  /** Master switch for the hero badge and the services-page section. */
  enabled: true,
  /** Use Microsoft's current wording, e.g. "Microsoft Solutions Partner" or "Microsoft CSP Partner". */
  badgeLabel: 'Microsoft AI Cloud Partner Program Member',
  /** Badge wording used once cspActive is true. */
  cspBadgeLabel: 'Microsoft CSP Partner',
  /** Microsoft Partner ID (formerly MPN ID). Shown as proof when set. */
  partnerId: '7154428' as string | null,
  /** Public verification link, e.g. your Microsoft AppSource / Partner Center listing. */
  verifyUrl: null as string | null,
  /**
   * Flip to true once CSP shows under Partner Center → Registered programs
   * (TD SYNNEX indirect-reseller application pending as of 2026-09-24).
   * Unlocks billing/distributor copy and the CSP badge wording.
   */
  cspActive: false,
  /** Section anchor on /services. */
  anchor: 'microsoft-cloud',
};

/** Microsoft 365 card: aggregate figures across managed tenants. */
export const M365_METRICS: PartnerMetric[] = [
  { label: 'Managed seats', value: null },
  { label: 'Tenants under management', value: null },
  { label: 'Copilot licenses deployed', value: null },
  { label: 'MFA coverage', value: null },
];

/** Azure card: aggregate figures across managed environments. */
export const AZURE_METRICS: PartnerMetric[] = [
  { label: 'Azure subscriptions managed', value: null },
  { label: 'Migrations completed', value: null },
  { label: 'Avg. cost reduction after review', value: null },
];

/** Badge text for the current enrollment state. */
export const partnerBadgeLabel = () =>
  MICROSOFT_PARTNER.cspActive ? MICROSOFT_PARTNER.cspBadgeLabel : MICROSOFT_PARTNER.badgeLabel;
