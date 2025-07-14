import React from 'react';
import { Select, SelectedItems, SelectItem } from '@heroui/react';

import { heightCategories } from './filterData';

const renderHeightCategoryValue = (selected: SelectedItems<object>) => {
  const selectedKey = Array.from(selected)[0]?.key;
  if (!selectedKey) return null;

  const heightCategory = heightCategories.find(
    category => category.key === selectedKey,
  );
  if (!heightCategory) return null;

  return (
    <span className="flex items-center">
      <span className="mr-2 text-lg" aria-hidden="true">
        {heightCategory.icon}
      </span>
      <span>{heightCategory.label}</span>
    </span>
  );
};

interface HeightCategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const HeightCategoryFilter: React.FC<HeightCategoryFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        Categoría de Altura
      </label>
      <Select
        placeholder="Todas las alturas"
        selectedKeys={value ? [value] : []}
        aria-label="Categoría de Altura"
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
        renderValue={renderHeightCategoryValue}
      >
        <>
          <SelectItem
            key=""
            textValue="Todas las alturas"
            aria-label="Todas las alturas"
            className="bg-zinc-800 text-white hover:bg-zinc-700 focus:bg-zinc-700"
          >
            Todas las alturas
          </SelectItem>

          {heightCategories.map(category => (
            <SelectItem
              key={category.key}
              className={`text-white${value === category.key ? 'font-semibold !text-white' : ''}`}
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

export default HeightCategoryFilter;
