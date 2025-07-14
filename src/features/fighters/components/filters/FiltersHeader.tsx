import React from 'react';
import { Button, Chip } from '@heroui/react';
import { Filter, X } from 'lucide-react';

interface FiltersHeaderProps {
  hasActiveFilters: boolean;
  resultsCount?: number;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const FiltersHeader: React.FC<FiltersHeaderProps> = ({
  hasActiveFilters,
  resultsCount,
  onClearFilters,
  showFilters,
  onToggleFilters,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Filter size={24} className="text-primary-500" aria-hidden="true" />
        <h2 className="text-xl font-bold text-white">Filtros de Búsqueda</h2>
        {hasActiveFilters && resultsCount !== undefined && (
          <Chip
            color="primary"
            size="sm"
            variant="flat"
            aria-label={`${resultsCount} resultados encontrados`}
          >
            {resultsCount} resultados
          </Chip>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="bordered"
            className="border-zinc-600 text-zinc-300 hover:border-white hover:text-white"
            startContent={<X size={16} aria-hidden="true" />}
            onPress={onClearFilters}
            aria-label="Limpiar filtros"
          >
            Limpiar
          </Button>
        )}
        <Button
          size="sm"
          variant="light"
          className="text-zinc-300 hover:text-white lg:hidden"
          startContent={<Filter size={16} aria-hidden="true" />}
          onPress={onToggleFilters}
          aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        >
          {showFilters ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>
    </div>
  );
};

export default FiltersHeader;
