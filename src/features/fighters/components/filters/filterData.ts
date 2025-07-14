export const heightCategories = [
  { key: 'short', label: 'Bajo (150-170 cm)', min: 150, max: 170, icon: '📏' },
  {
    key: 'medium',
    label: 'Medio (170-180 cm)',
    min: 170,
    max: 180,
    icon: '📏📏',
  },
  {
    key: 'tall',
    label: 'Alto (180-190 cm)',
    min: 180,
    max: 190,
    icon: '📏📏📏',
  },
  {
    key: 'very-tall',
    label: 'Muy Alto (190+ cm)',
    min: 190,
    max: 220,
    icon: '📏📏📏📏',
  },
];

export const weightCategories = [
  {
    key: 'flyweight',
    label: 'Peso Mosca (50-57 kg)',
    min: 50,
    max: 57,
    icon: '🪰',
  },
  {
    key: 'bantamweight',
    label: 'Peso Gallo (57-61 kg)',
    min: 57,
    max: 61,
    icon: '🐓',
  },
  {
    key: 'featherweight',
    label: 'Peso Pluma (61-66 kg)',
    min: 61,
    max: 66,
    icon: '🪶',
  },
  {
    key: 'lightweight',
    label: 'Peso Ligero (66-70 kg)',
    min: 66,
    max: 70,
    icon: '⚡',
  },
  {
    key: 'welterweight',
    label: 'Peso Welter (70-77 kg)',
    min: 70,
    max: 77,
    icon: '🥊',
  },
  {
    key: 'middleweight',
    label: 'Peso Medio (77-84 kg)',
    min: 77,
    max: 84,
    icon: '💪',
  },
  {
    key: 'light-heavyweight',
    label: 'Peso Semipesado (84-93 kg)',
    min: 84,
    max: 93,
    icon: '🦾',
  },
  {
    key: 'heavyweight',
    label: 'Peso Pesado (93+ kg)',
    min: 93,
    max: 150,
    icon: '🏋️',
  },
];

export const bodyTypes = [
  {
    key: 'slim',
    label: 'Delgado (IMC < 18.5)',
    icon: '🧍',
    check: (height: number, weight: number) => {
      const imc = weight / Math.pow(height / 100, 2);
      return imc < 18.5;
    },
  },
  {
    key: 'athletic',
    label: 'Atlético (IMC 18.5-24.9)',
    icon: '🏃',
    check: (height: number, weight: number) => {
      const imc = weight / Math.pow(height / 100, 2);
      return imc >= 18.5 && imc < 24.9;
    },
  },
  {
    key: 'muscular',
    label: 'Musculoso (IMC 25-29.9)',
    icon: '💪',
    check: (height: number, weight: number) => {
      const imc = weight / Math.pow(height / 100, 2);
      return imc >= 25 && imc < 29.9;
    },
  },
  {
    key: 'bulky',
    label: 'Corpulento (IMC > 30)',
    icon: '🏋️',
    check: (height: number, weight: number) => {
      const imc = weight / Math.pow(height / 100, 2);
      return imc >= 30;
    },
  },
];

export const nationalities = [
  { key: 'españa', label: 'España', icon: '/flags/es.svg' },
  { key: 'argentina', label: 'Argentina', icon: '/flags/ar.svg' },
];
