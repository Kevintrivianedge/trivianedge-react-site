/** Shared between TalentHubPage and TalentHubModal so hub URLs stay in sync without pulling the full page bundle into the homepage modal chunk. */
export function slugifyCountry(country: string): string {
  return country.toLowerCase().replace(/\s+/g, '-');
}

/** Country name as used in running text ("in the Philippines", "in Vietnam"). */
export const inCountry = (country: string): string =>
  country === 'Philippines' ? 'the Philippines' : country;
