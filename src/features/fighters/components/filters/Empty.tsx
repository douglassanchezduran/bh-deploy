import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@heroui/react';

interface Props {
  clearFilters: () => void;
}

const Empty: React.FC<Props> = ({ clearFilters }) => {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800">
        <Search size={32} className="text-zinc-500" />
      </div>

      <h3 className="mb-4 text-2xl font-bold text-white">
        No se encontraron competidores
      </h3>

      <p className="mx-auto mb-8 max-w-md text-lg text-zinc-400">
        No hay guerreros que coincidan con los filtros seleccionados. Intenta
        ajustar los criterios de búsqueda.
      </p>

      <Button
        color="primary"
        variant="bordered"
        size="lg"
        className="px-8 font-medium"
        onPress={clearFilters}
      >
        Limpiar Filtros
      </Button>
    </div>
  );
};

export default Empty;
