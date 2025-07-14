import React from 'react';
import { Search } from 'lucide-react';
import { Image } from '@heroui/react';

import { Fighter } from '../models/Fighter';

interface Props {
  fighter: Fighter;
  onClickImage: (fighter: Fighter) => void;
}

const FighterItemHeader: React.FC<Props> = ({ fighter, onClickImage }) => {
  const handleImageClick = () => onClickImage(fighter);

  return (
    <div className="group relative flex-shrink-0">
      <Image
        src={fighter.photoUrl}
        alt={fighter.name}
        className="h-40 w-32 cursor-pointer rounded-xl border-3 border-primary-500 object-cover shadow-xl shadow-primary-500/50 transition-all duration-300 hover:brightness-110 group-hover:scale-110 group-hover:border-primary-400 group-hover:shadow-2xl group-hover:shadow-primary-500/70"
        title="Haz clic para ver imagen completa"
        onClick={handleImageClick}
      />

      {/* Overlay de hover para indicar que es clickeable */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="scale-0 transform rounded-full bg-white/90 p-2 transition-transform duration-300 group-hover:scale-100">
          <Search size={12} className="text-zinc-900" />
        </div>
      </div>
    </div>
  );
};

export default FighterItemHeader;
