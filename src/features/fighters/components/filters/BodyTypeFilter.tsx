import React from 'react';
import { Button, ButtonGroup } from '@heroui/react';
import { bodyTypes } from './filterData';

interface BodyTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const BodyTypeFilter: React.FC<BodyTypeFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-zinc-300">
        Tipo de Cuerpo (basado en IMC)
      </label>
      <ButtonGroup className="w-full">
        <Button
          variant={value === '' ? 'solid' : 'bordered'}
          color={value === '' ? 'primary' : 'default'}
          className={`flex-1 ${value === '' ? 'text-white' : 'border-zinc-600 text-zinc-300 hover:border-white hover:text-white'}`}
          onPress={() => onChange('')}
          aria-label="Mostrar todos los tipos de cuerpo"
        >
          Todos
        </Button>

        {bodyTypes.map(bodyType => (
          <Button
            key={bodyType.key}
            variant={value === bodyType.key ? 'solid' : 'bordered'}
            color={value === bodyType.key ? 'primary' : 'default'}
            className={`flex-1 ${value === bodyType.key ? 'text-white' : 'border-zinc-600 text-zinc-300 hover:border-white hover:text-white'}`}
            onPress={() => onChange(bodyType.key)}
            startContent={
              <span className="text-lg" aria-hidden="true">
                {bodyType.icon}
              </span>
            }
            aria-label={`Filtrar por tipo de cuerpo: ${bodyType.label}`}
          >
            <span className="hidden sm:inline">{bodyType.label}</span>
            <span className="sm:hidden">
              {bodyType.key.charAt(0).toUpperCase() + bodyType.key.slice(1)}
            </span>
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default BodyTypeFilter;
