import React from 'react';
import { Input } from '@heroui/react';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-zinc-300"
        id="search-label"
      >
        Nombre o Alias
      </label>
      <Input
        placeholder="Buscar guerrero..."
        value={value}
        onValueChange={onChange}
        startContent={
          <Search size={18} className="text-zinc-400" aria-hidden="true" />
        }
        className="max-w-full"
        classNames={{
          input: '!text-white placeholder:!text-white',
          inputWrapper:
            'bg-zinc-700 border-zinc-600 !bg-zinc-700 !border-zinc-600 !focus:bg-zinc-700 !focus:border-zinc-600 !hover:bg-zinc-700 !hover:border-zinc-600',
        }}
        aria-labelledby="search-label"
      />
    </div>
  );
};

export default SearchFilter;
