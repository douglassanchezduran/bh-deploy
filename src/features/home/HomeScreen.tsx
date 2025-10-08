import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@heroui/react';
import { Play, Shield } from 'lucide-react';

import videoBg from './assets/background.mp4';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const goToFighters = () => navigate('/fighters');
  const goToBattleArena = () => navigate('/battle-arena');

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 h-full w-full">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoBg} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-20 flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-8xl">
              Bienvenido a
              <span className="block font-black text-primary-500 drop-shadow-lg">
                Beat Hard
              </span>
            </h1>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-zinc-200 drop-shadow-lg sm:text-2xl lg:text-3xl">
              Donde los guerreros más valientes se enfrentan en batallas épicas.
              <span className="mt-2 block text-zinc-300">
                Únete a la competencia y demuestra tu valor.
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row">
            <Button
              color="primary"
              size="lg"
              startContent={<Play size={28} />}
              className="transform bg-primary-500 px-12 py-8 text-xl font-bold text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary-600 hover:shadow-primary-500/40"
              onPress={goToBattleArena}
            >
              Comenzar Combate
            </Button>
            <Button
              variant="bordered"
              size="lg"
              startContent={<Shield size={28} />}
              className="transform border-2 border-white/80 px-12 py-8 text-xl font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-zinc-950 hover:shadow-white/25"
              onPress={goToFighters}
            >
              Ver Competidores
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
