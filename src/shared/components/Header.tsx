import React from 'react';
import { Sword } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

const Header: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="mb-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25">
          <Sword size={32} className="text-white" />
        </div>
      </div>
      <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mb-8 max-w-3xl text-xl text-zinc-300 sm:text-2xl">
        {description}
      </p>
    </div>
  );
};

export default Header;
