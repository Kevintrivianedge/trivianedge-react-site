/** Shared between TalentHubPage and TalentHubModal so hub URLs stay in sync without pulling the full page bundle into the homepage modal chunk. */
export function slugifyCountry(country: string): string {
  return country.toLowerCase().replace(/\s+/g, '-');
}
