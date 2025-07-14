import { NavbarBrand, NavbarContent } from '@heroui/react';
import { useNavigate } from 'react-router';

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NavbarContent>
      <NavbarBrand>
        <div
          className="group flex cursor-pointer items-center py-3"
          onClick={() => navigate('/')}
        >
          <div className="relative flex items-center">
            {/* Ondas de energía concéntricas */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 animate-ping rounded-full border-2 border-primary-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="absolute h-40 w-40 animate-ping rounded-full border border-red-400/20 opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100"></div>
              <div className="delay-400 absolute h-48 w-48 animate-ping rounded-full border border-primary-300/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
            </div>

            {/* Anillo rotatorio de energía */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="h-28 w-28 animate-spin rounded-full border-4 border-transparent border-r-red-400 border-t-primary-500"></div>
            </div>

            {/* Segundo anillo rotatorio en dirección opuesta */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity delay-300 duration-700 group-hover:opacity-100">
              <div
                className="h-36 w-36 animate-spin rounded-full border-2 border-transparent border-b-primary-400 border-l-red-300"
                style={{ animationDirection: 'reverse' }}
              ></div>
            </div>

            {/* Resplandor de fondo pulsante */}
            <div className="bg-gradient-radial absolute inset-0 scale-150 animate-pulse rounded-full from-primary-500/40 via-red-500/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

            {/* Logo principal con rotación sutil */}
            <div className="relative z-10 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
              <img
                src="/logo-w.png"
                alt="HARD"
                className="h-20 w-auto brightness-100 drop-shadow-2xl filter transition-all duration-500 group-hover:brightness-125 group-hover:drop-shadow-[0_0_40px_rgba(218,41,44,1)]"
              />
            </div>

            {/* Partículas de energía flotantes */}
            <div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-primary-400 opacity-0 transition-opacity delay-100 duration-300 group-hover:animate-bounce group-hover:opacity-100"></div>
            <div className="absolute right-0 top-2 h-1.5 w-1.5 rounded-full bg-red-400 opacity-0 transition-opacity delay-200 duration-300 group-hover:animate-bounce group-hover:opacity-100"></div>
            <div className="absolute bottom-0 left-2 h-1 w-1 rounded-full bg-primary-300 opacity-0 transition-opacity delay-300 duration-300 group-hover:animate-bounce group-hover:opacity-100"></div>
            <div className="delay-400 absolute bottom-2 right-2 h-2 w-2 rounded-full bg-red-300 opacity-0 transition-opacity duration-300 group-hover:animate-bounce group-hover:opacity-100"></div>

            {/* Rayos de energía */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {/* Rayo superior */}
              <div className="absolute left-1/2 top-0 h-8 w-0.5 -translate-x-1/2 -translate-y-full transform animate-pulse bg-gradient-to-t from-primary-500 to-transparent"></div>
              {/* Rayo derecho */}
              <div className="absolute right-0 top-1/2 h-0.5 w-8 -translate-y-1/2 translate-x-full transform animate-pulse bg-gradient-to-r from-red-500 to-transparent delay-150"></div>
              {/* Rayo inferior */}
              <div className="absolute bottom-0 left-1/2 h-8 w-0.5 -translate-x-1/2 translate-y-full transform animate-pulse bg-gradient-to-b from-primary-400 to-transparent delay-300"></div>
              {/* Rayo izquierdo */}
              <div className="delay-450 absolute left-0 top-1/2 h-0.5 w-8 -translate-x-full -translate-y-1/2 transform animate-pulse bg-gradient-to-l from-red-400 to-transparent"></div>
            </div>

            {/* Efecto de destello central */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="h-4 w-4 animate-ping rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </NavbarBrand>
    </NavbarContent>
  );
};

export default Logo;
