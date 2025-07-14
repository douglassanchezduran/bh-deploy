import React, { useState } from 'react';
import { Card, CardBody } from '@heroui/react';

// Importar componentes
import FiltersHeader from './filters/FiltersHeader';
import SearchFilter from './filters/SearchFilter';
import HeightCategoryFilter from './filters/HeightCategoryFilter';
import WeightCategoryFilter from './filters/WeightCategoryFilter';
// import BodyTypeFilter from './filters/BodyTypeFilter';

// Importar tipos
import { FiltersState, initialFilters } from './filters/types';
import NationalityFilter from './filters/NationalityFilter';

interface Props {
  onChange: (filters: FiltersState) => void;
  filters: FiltersState;
  resultsCount?: number;
}

const Filters: React.FC<Props> = ({ onChange, filters, resultsCount }) => {
  const [showFilters, setShowFilters] = useState(true);

  // Determinar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Actualizar filtros y notificar al componente padre
  const updateFilters = (newFilters: Partial<FiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    onChange(updatedFilters);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    onChange(initialFilters);
  };

  // Manejadores para cada tipo de filtro
  const handleSearchChange = (value: string) => {
    updateFilters({ searchName: value });
  };

  const handleHeightCategoryChange = (value: string) => {
    updateFilters({ heightCategory: value });
  };

  const handleWeightCategoryChange = (value: string) => {
    updateFilters({ weightCategory: value });
  };

  /* const handleBodyTypeChange = (value: string) => {
    updateFilters({ bodyType: value });
  }; */

  const handleNationalityChange = (value: string) => {
    updateFilters({ nationality: value });
  };

  return (
    <Card className="mb-8 border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
      <CardBody className="p-6">
        <FiltersHeader
          hasActiveFilters={hasActiveFilters}
          resultsCount={resultsCount}
          onClearFilters={clearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <div
          className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <SearchFilter
              value={filters.searchName}
              onChange={handleSearchChange}
            />

            <NationalityFilter
              value={filters.nationality}
              onChange={handleNationalityChange}
            />

            <HeightCategoryFilter
              value={filters.heightCategory}
              onChange={handleHeightCategoryChange}
            />

            <WeightCategoryFilter
              value={filters.weightCategory}
              onChange={handleWeightCategoryChange}
            />
          </div>

          {/* <BodyTypeFilter
            value={filters.bodyType}
            onChange={handleBodyTypeChange}
          /> */}
        </div>
      </CardBody>
    </Card>
  );
};

export default Filters;
