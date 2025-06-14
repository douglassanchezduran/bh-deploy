import React from 'react';
import { NavbarBrand, NavbarContent } from '@heroui/react';
import { useNavigate } from 'react-router';

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NavbarContent>
      <NavbarBrand>
        <div
          className="
            flex items-center
            cursor-pointer
            group
            py-3
          "
          onClick={() => navigate('/')}
        >
          <div
            className="
            relative
            flex items-center
          "
          >
            {/* Ondas de energía concéntricas */}
            <div
              className="
              absolute inset-0
              flex items-center justify-center
            "
            >
              <div
                className="
                w-32 h-32
                border-2 border-primary-500/30 rounded-full
                animate-ping
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
              "
              ></div>
              <div
                className="
                absolute
                w-40 h-40
                border border-red-400/20 rounded-full
                animate-ping
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500 delay-200
              "
              ></div>
              <div
                className="
                absolute
                w-48 h-48
                border border-primary-300/10 rounded-full
                animate-ping
                opacity-0 group-hover:opacity-100
                transition-opacity duration-700 delay-400
              "
              ></div>
            </div>

            {/* Anillo rotatorio de energía */}
            <div
              className="
              absolute inset-0
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "
            >
              <div
                className="
                w-28 h-28
                border-4 border-transparent border-t-primary-500 border-r-red-400 rounded-full
                animate-spin
              "
              ></div>
            </div>

            {/* Segundo anillo rotatorio en dirección opuesta */}
            <div
              className="
              absolute inset-0
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-opacity duration-700 delay-300
            "
            >
              <div
                className="
                w-36 h-36
                border-2 border-transparent border-b-primary-400 border-l-red-300 rounded-full
                animate-spin
              "
                style={{ animationDirection: 'reverse' }}
              ></div>
            </div>

            {/* Resplandor de fondo pulsante */}
            <div
              className="
              absolute inset-0
              bg-gradient-radial from-primary-500/40 via-red-500/20 to-transparent
              rounded-full
              opacity-0 group-hover:opacity-100
              animate-pulse
              transition-opacity duration-500
              scale-150 blur-xl
            "
            ></div>

            {/* Logo principal con rotación sutil */}
            <div
              className="
              relative
              z-10
              transition-all duration-700
              group-hover:rotate-12 group-hover:scale-110
            "
            >
              <img
                src="/logo-w.png"
                alt="HARD"
                className="
                  h-20 w-auto
                  filter brightness-100 group-hover:brightness-125
                  transition-all duration-500
                  drop-shadow-2xl group-hover:drop-shadow-[0_0_40px_rgba(218,41,44,1)]
                "
              />
            </div>

            {/* Partículas de energía flotantes */}
            <div
              className="
              absolute top-0 left-0
              w-2 h-2
              bg-primary-400 rounded-full
              opacity-0 group-hover:opacity-100
              group-hover:animate-bounce
              transition-opacity duration-300 delay-100
            "
            ></div>
            <div
              className="
              absolute top-2 right-0
              w-1.5 h-1.5
              bg-red-400 rounded-full
              opacity-0 group-hover:opacity-100
              group-hover:animate-bounce
              transition-opacity duration-300 delay-200
            "
            ></div>
            <div
              className="
              absolute bottom-0 left-2
              w-1 h-1
              bg-primary-300 rounded-full
              opacity-0 group-hover:opacity-100
              group-hover:animate-bounce
              transition-opacity duration-300 delay-300
            "
            ></div>
            <div
              className="
              absolute bottom-2 right-2
              w-2 h-2
              bg-red-300 rounded-full
              opacity-0 group-hover:opacity-100
              group-hover:animate-bounce
              transition-opacity duration-300 delay-400
            "
            ></div>

            {/* Rayos de energía */}
            <div
              className="
              absolute inset-0
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "
            >
              {/* Rayo superior */}
              <div
                className="
                absolute top-0 left-1/2
                w-0.5 h-8
                bg-gradient-to-t from-primary-500 to-transparent
                transform -translate-x-1/2 -translate-y-full
                animate-pulse
              "
              ></div>
              {/* Rayo derecho */}
              <div
                className="
                absolute top-1/2 right-0
                w-8 h-0.5
                bg-gradient-to-r from-red-500 to-transparent
                transform -translate-y-1/2 translate-x-full
                animate-pulse delay-150
              "
              ></div>
              {/* Rayo inferior */}
              <div
                className="
                absolute bottom-0 left-1/2
                w-0.5 h-8
                bg-gradient-to-b from-primary-400 to-transparent
                transform -translate-x-1/2 translate-y-full
                animate-pulse delay-300
              "
              ></div>
              {/* Rayo izquierdo */}
              <div
                className="
                absolute top-1/2 left-0
                w-8 h-0.5
                bg-gradient-to-l from-red-400 to-transparent
                transform -translate-y-1/2 -translate-x-full
                animate-pulse delay-450
              "
              ></div>
            </div>

            {/* Efecto de destello central */}
            <div
              className="
              absolute inset-0
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
            >
              <div
                className="
                w-4 h-4
                bg-white rounded-full
                animate-ping
              "
              ></div>
            </div>
          </div>
        </div>
      </NavbarBrand>
    </NavbarContent>
  );
};

export default Logo;
