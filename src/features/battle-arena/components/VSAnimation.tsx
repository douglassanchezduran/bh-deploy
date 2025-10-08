import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VSAnimationProps {
  animationPhase: 'slide' | 'clash' | 'vs' | 'complete';
  showAnimation: boolean;
}

const VSAnimation: React.FC<VSAnimationProps> = ({
  animationPhase,
  showAnimation,
}) => {
  // Variantes para efectos de impacto
  const impactVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 2, 3],
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  // Variantes para el texto VS
  const vsVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: [0, 1.3, 1],
      rotate: 0,
      transition: {
        duration: 0.7,
        ease: 'backOut',
        scale: {
          times: [0, 0.6, 1],
          ease: 'backOut',
        },
      },
    },
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
      <AnimatePresence>
        {animationPhase === 'clash' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-white"
              variants={impactVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ zIndex: 40 }}
            />

            <motion.div
              className="absolute h-40 w-40 rounded-full border-4 border-white"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 3, 5],
                opacity: [1, 0.5, 0],
                borderWidth: [4, 2, 0],
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ zIndex: 35 }}
            />

            <motion.div
              className="absolute h-32 w-32 rounded-full border-2 border-primary-500"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 4, 6],
                opacity: [1, 0.3, 0],
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
                delay: 0.1,
              }}
              style={{ zIndex: 35 }}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationPhase === 'vs' && (
          <div className="relative">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-yellow-500"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 120,
                  y: Math.sin((i * Math.PI * 2) / 8) * 120,
                  opacity: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 0.7,
                  ease: 'easeOut',
                  delay: i * 0.05,
                }}
              />
            ))}

            <motion.div
              className="absolute h-1 w-1 bg-blue-400 shadow-lg shadow-blue-400/50"
              style={{
                left: '-300px',
                top: '50%',
                transformOrigin: 'right center',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 300, 0],
                opacity: [0, 1, 0],
                boxShadow: [
                  '0 0 0px rgba(59, 130, 246, 0)',
                  '0 0 20px rgba(59, 130, 246, 1)',
                  '0 0 0px rgba(59, 130, 246, 0)',
                ],
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />

            <motion.div
              className="absolute h-1 w-1 bg-red-400 shadow-lg shadow-red-400/50"
              style={{
                right: '-300px',
                top: '50%',
                transformOrigin: 'left center',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 300, 0],
                opacity: [0, 1, 0],
                boxShadow: [
                  '0 0 0px rgba(239, 68, 68, 0)',
                  '0 0 20px rgba(239, 68, 68, 1)',
                  '0 0 0px rgba(239, 68, 68, 0)',
                ],
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />

            <motion.div
              className="bg-gradient-radial absolute inset-0 rounded-full from-primary-500/40 via-red-500/20 to-transparent blur-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2.5, 2],
                opacity: [0, 0.8, 0.4],
              }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ width: '300px', height: '300px', zIndex: 25 }}
            />

            <motion.div
              variants={vsVariants}
              initial="hidden"
              animate="visible"
              className="relative z-30"
            >
              <div
                className="select-none text-9xl font-black text-white"
                style={{
                  WebkitTextStroke: '6px #da292c',
                  textShadow: `
                    0 0 30px rgba(218,41,44,1),
                    0 0 60px rgba(218,41,44,0.8),
                    8px 8px 0px #000000,
                    16px 16px 0px #333333
                  `,
                  filter: 'drop-shadow(0 0 40px rgba(218,41,44,1))',
                }}
              >
                VS
              </div>
            </motion.div>

            <motion.div
              className="absolute inset-0 select-none text-9xl font-black text-white opacity-20 blur-sm"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ zIndex: 28 }}
            >
              VS
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!showAnimation && (
        <div className="relative">
          <div
            className="select-none text-9xl font-black text-white"
            style={{
              WebkitTextStroke: '5px #da292c',
              textShadow:
                '0 0 30px rgba(218,41,44,0.8), 8px 8px 0px #000000, 16px 16px 0px #333333',
              filter: 'drop-shadow(0 0 30px rgba(218,41,44,0.8))',
            }}
          >
            VS
          </div>
        </div>
      )}
    </div>
  );
};

export default VSAnimation;
