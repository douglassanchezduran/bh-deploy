export const nationalities = [
  { key: 'españa', label: 'España', icon: 'assets/flags/es.svg' },
  { key: 'argentina', label: 'Argentina', icon: 'assets/flags/ar.svg' },
];

export function getNationality(country) {
  if (!country || typeof country !== 'string') {
    return null;
  }
  return nationalities.find(n => n.key === country.toLowerCase());
}
