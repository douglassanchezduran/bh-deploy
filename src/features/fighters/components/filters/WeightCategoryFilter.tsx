import React from 'react';
import { Select, SelectItem, SelectedItems } from '@heroui/react';
import { weightCategories } from './filterData';

const renderWeightCategoryValue = (selected: SelectedItems<object>) => {
  const selectedKey = Array.from(selected)[0]?.key;
  if (!selectedKey) return null;

  const weightCategory = weightCategories.find(
    category => category.key === selectedKey,
  );
  if (!weightCategory) return null;

  return (
    <span className="flex items-center">
      <span className="mr-2 text-lg" aria-hidden="true">
        {weightCategory.icon}
      </span>
      <span>{weightCategory.label}</span>
    </span>
  );
};

interface WeightCategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const WeightCategoryFilter: React.FC<WeightCategoryFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        Categoría de Peso
      </label>
      <Select
        placeholder="Todas las categorías"
        aria-label="Categoría de Peso"
        selectedKeys={value ? [value] : []}
        onSelectionChange={keys => {
          const selected = Array.from(keys)[0] as string;
          onChange(selected || '');
        }}
        className="max-w-full"
        classNames={{
          trigger:
            'bg-zinc-700 border-zinc-600 !bg-zinc-700 !border-zinc-600 !focus:bg-zinc-700 !focus:border-zinc-600 !hover:bg-zinc-700 !hover:border-zinc-600',
          value: '!text-white',
          selectorIcon: '!text-white',
          listbox: 'bg-zinc-800',
          popoverContent: 'bg-zinc-800 border-zinc-700',
        }}
        renderValue={renderWeightCategoryValue}
      >
        <>
          <SelectItem
            key=""
            textValue="Todas las categorías"
            aria-label="Todas las categorías"
            className="bg-zinc-800 text-white hover:bg-zinc-700 focus:bg-zinc-700"
          >
            Todas las categorías
          </SelectItem>

          {weightCategories.map(category => (
            <SelectItem
              key={category.key}
              className={`text-white${value === category.key ? 'font-semibold text-white' : ''}`}
              startContent={
                <span className="text-lg" aria-hidden="true">
                  {category.icon}
                </span>
              }
              textValue={category.label}
              aria-label={category.label}
            >
              {category.label}
            </SelectItem>
          ))}
        </>
      </Select>
    </div>
  );
};

export default WeightCategoryFilter;
