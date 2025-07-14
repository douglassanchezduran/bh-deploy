import { useMemo } from 'react';

import { Fighter } from '../models/Fighter';
import { FiltersState } from '../components/filters/types';
import {
  heightCategories,
  weightCategories,
} from '../components/filters/filterData';

export function useFilteredFighters(
  fighters: Fighter[],
  filters: FiltersState,
) {
  return useMemo(() => {
    return fighters.filter(fighter => {
      // Filtro por nombre o alias
      const nameMatch =
        filters.searchName === '' ||
        fighter.name.toLowerCase().includes(filters.searchName.toLowerCase());

      // Filtro por nacionalidad
      const nationalityMatch =
        filters.nationality === '' ||
        fighter.country.toLowerCase() === filters.nationality.toLowerCase();

      // Filtro por categoría de altura
      const heightMatch =
        filters.heightCategory === '' ||
        (() => {
          const category = heightCategories.find(
            cat => cat.key === filters.heightCategory,
          );
          return category
            ? fighter.height >= category.min && fighter.height <= category.max
            : true;
        })();

      // Filtro por categoría de peso
      const weightMatch =
        filters.weightCategory === '' ||
        (() => {
          const category = weightCategories.find(
            category => category.key === filters.weightCategory,
          );
          return category
            ? fighter.weight >= category.min && fighter.weight <= category.max
            : true;
        })();

      return nameMatch && nationalityMatch && heightMatch && weightMatch;
    });
  }, [fighters, filters]);
}
