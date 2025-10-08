import { nationalities } from '@features/fighters/components/filters/filterData';

export function getNationalityByKey(countryKey?: string) {
  if (!countryKey) return undefined;
  return nationalities.find(n => n.key === countryKey.toLowerCase());
}
