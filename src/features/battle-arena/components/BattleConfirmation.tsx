import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { Play, X, Target } from 'lucide-react';
import { motion } from 'framer-motion';

import { useWebSocketBroadcast } from '@hooks/useWebSocketBroadcast';

import useBattleStore from '../stores/useBattleStore';
import VSAnimation from './VSAnimation';
import FighterCard from './FighterCard';
import SummaryConfiguration from './battle-configuration/SummaryConfiguration';

const cardColors = {
  red: {
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    shadowColor: 'shadow-red-500/50',
  },
  blue: {
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    shadowColor: 'shadow-blue-500/50',
  },
};

interface CombatConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const BattleConfirmation: React.FC<CombatConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  const competitor1 = useBattleStore(state => state.competitor1);
  const competitor2 = useBattleStore(state => state.competitor2);
  const battleConfig = useBattleStore(state => state.battleConfig);
  const { broadcastViewChange, openBroadcastUrl } = useWebSocketBroadcast();

  const [showAnimation, setShowAnimation] = useState(false); // Inicialmente false
  const [animationPhase, setAnimationPhase] = useState<
    'slide' | 'clash' | 'vs' | 'complete'
  >('slide');
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll al Card y luego iniciar animaciones
  useEffect(() => {
    const scrollToCard = () => {
      if (cardRef.current) {
        cardRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Esperar a que termine el scroll antes de iniciar animaciones
        setTimeout(() => {
          setShowAnimation(true);
        }, 500); // Tiempo para que termine el scroll
      }
    };

    scrollToCard();
  }, []);

  useEffect(() => {
    if (showAnimation) {
      const slideTimer = setTimeout(() => setAnimationPhase('clash'), 1000);
      const clashTimer = setTimeout(() => setAnimationPhase('vs'), 1300);
      const vsTimer = setTimeout(() => {
        setAnimationPhase('complete');
        setShowAnimation(false);
      }, 2000);

      return () => {
        clearTimeout(slideTimer);
        clearTimeout(clashTimer);
        clearTimeout(vsTimer);
      };
    }
  }, [showAnimation]);

  const handleConfirmCombat = async () => {
    // Ir a la siguiente pantalla
    onConfirm();

    // Abrir navegador con la portada
    await openBroadcastUrl('/index.html');

    // Esperar a que el navegador cargue completamente
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mostrar Portada
    const data = {
      competitor1,
      competitor2,
      battleConfig,
    };

    await broadcastViewChange('cover', data);
  };

  const cardVariants = {
    initial: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? -800 : 800,
      opacity: 0,
      scale: 0.8,
    }),
    slide: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
    clash: {
      x: 0,
      scale: [1, 1.1, 0.95, 1],
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  return (
    <Card
      ref={cardRef}
      className="mb-8 border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm"
    >
      <CardBody className="p-8">
        <div className="mb-8">
          <div className="flex w-full flex-col items-end gap-6 md:flex-row md:gap-8">
            <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
              <Target size={20} />
              Confirmación de Combate
            </h3>
          </div>

          <div className="relative flex min-h-[600px] items-center justify-center gap-8">
            <motion.div
              custom="left"
              variants={cardVariants}
              initial="initial"
              animate={
                showAnimation
                  ? animationPhase === 'slide'
                    ? 'slide'
                    : 'clash'
                  : 'slide'
              }
              className="relative z-10 max-w-md flex-1"
            >
              <FighterCard
                competitor={competitor1}
                teamColor="red"
                layout="vertical"
                {...cardColors['red']}
              />
            </motion.div>

            <VSAnimation
              animationPhase={animationPhase}
              showAnimation={showAnimation}
            />

            <motion.div
              custom="right"
              variants={cardVariants}
              initial="initial"
              animate={
                showAnimation
                  ? animationPhase === 'slide'
                    ? 'slide'
                    : 'clash'
                  : 'slide'
              }
              className="relative z-10 max-w-md flex-1"
            >
              <FighterCard
                competitor={competitor2}
                teamColor="blue"
                layout="vertical"
                {...cardColors['blue']}
              />
            </motion.div>
          </div>
        </div>

        <SummaryConfiguration />

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button
            color="primary"
            size="lg"
            className="transform bg-primary-500 px-12 py-8 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-primary-600 hover:shadow-primary-500/40"
            startContent={<Play size={28} />}
            onPress={handleConfirmCombat}
          >
            ¡Comenzar Combate!
          </Button>

          <Button
            variant="bordered"
            size="lg"
            className="border-2 border-zinc-600 px-12 py-8 text-xl font-semibold text-zinc-300 transition-all duration-300 hover:bg-zinc-800 hover:text-white"
            startContent={<X size={28} />}
            onPress={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BattleConfirmation;
