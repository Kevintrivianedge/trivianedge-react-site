// Single source of truth for the Google partnership claim.
// Everything here renders publicly, so only claim what the Partner Network Hub shows.
//
// Status (2026-10-07): Partner Network Hub account is manually verified.
// No tier, specialization or Workspace resale authorization is confirmed, so
// never use "Authorized", "Premier" or reseller wording.

export const GOOGLE_PARTNER = {
  /** Master switch for the hero badge and partner copy. */
  enabled: true,
  /** Text-only until the official badge is generated in the Hub. */
  badgeLabel: 'Google Partner Network Member',
  /** Partner ID from Partner Network Hub → Your company → Account. */
  partnerId: 'eullM5rLyn' as string | null,
  /** Public verification link, e.g. a Google Cloud partner directory listing. */
  verifyUrl: null as string | null,
  /** Official badge image once the Hub generates it. null keeps the badge text-only. */
  logoSrc: null as string | null,
};
