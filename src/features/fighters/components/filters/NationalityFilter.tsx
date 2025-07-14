import React from 'react';
import { Select, SelectedItems, SelectItem } from '@heroui/react';

import { nationalities } from './filterData';

const renderNationalityValue = (selected: SelectedItems<object>) => {
  const selectedKey = selected[0]?.key;
  if (!selectedKey) return null;

  const nationality = nationalities.find(n => n.key === selectedKey);
  if (!nationality) return null;

  return (
    <span className="flex items-center">
      <img
        src={nationality.icon}
        alt={`${nationality.label} flag`}
        className="mr-2 inline-block h-5 w-7 rounded-sm object-contain"
        aria-hidden="true"
      />
      <span>{nationality.label}</span>
    </span>
  );
};

interface NationalityFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const NationalityFilter: React.FC<NationalityFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label
        id="nationality-filter-label"
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        Nacionalidad
      </label>
      <Select
        aria-labelledby="nationality-filter-label"
        placeholder="Todas las nacionalidades"
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
        renderValue={renderNationalityValue}
      >
        <>
          <SelectItem
            key=""
            textValue="Todas las nacionalidades"
            aria-label="Todas las nacionalidades"
            className="bg-zinc-800 text-white hover:bg-zinc-700 focus:bg-zinc-700"
          >
            Todas las nacionalidades
          </SelectItem>

          {nationalities.map(nationality => (
            <SelectItem
              key={nationality.key}
              textValue={nationality.label}
              aria-label={nationality.label}
              className="bg-zinc-800 text-white hover:bg-zinc-700 focus:bg-zinc-700"
            >
              <img
                src={nationality.icon}
                alt={`${nationality.label} flag`}
                className="mr-2 inline-block h-5 w-7 rounded-sm object-contain"
                aria-hidden="true"
              />
              {nationality.label}
            </SelectItem>
          ))}
        </>
      </Select>
    </div>
  );
};

export default NationalityFilter;
