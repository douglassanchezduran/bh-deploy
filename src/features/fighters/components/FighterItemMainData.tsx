import React from 'react';

import { Fighter } from '../models/Fighter';
import { nationalities } from './filters/filterData';

interface Props {
  fighter: Fighter;
}

const FighterItemMainData: React.FC<Props> = ({ fighter }) => {
  const nationality = nationalities.find(
    n => n.key === fighter.country.toLowerCase(),
  );

  return (
    <div className="min-w-0 flex-1">
      <div className={`mb-3 ${fighter.name ? 'space-y-1' : 'space-y-2'}`}>
        <h3 className="mb-1 truncate text-lg font-bold text-white">
          {fighter.name}
        </h3>
        {/* Solo mostrar alias si existe */}
        {fighter.name && (
          <p className="text-sm font-medium text-primary-400">
            "{fighter.name}"
          </p>
        )}
        {/* Si no hay alias, agregar espacio extra para mantener balance visual */}
        {!fighter.name && <div className="h-2"></div>}
      </div>

      <div className="mb-3 mt-5 flex items-center gap-2">
        <img
          src={nationality?.icon}
          alt={`${nationality?.label} flag`}
          className="inline-block h-5 w-7 rounded-sm object-contain"
          aria-hidden="true"
        />
        <span className="text-sm font-medium capitalize text-white">
          {nationality?.label}
        </span>
      </div>
    </div>
  );
};

export default FighterItemMainData;
