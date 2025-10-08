import React from 'react';
import { Card, CardBody, Badge, Progress, Chip } from '@heroui/react';
import { Zap, Hand, Footprints } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CombatEvent } from '@features/battle-arena/types';
import type { Competitor } from '../../../types';
import EventItem from './EventItem';
import CompetitorAvatar from './CompetitorAvatar';

interface CompetitorStats {
  totalHits: number;
  maxForce: number;
  maxAcceleration: number;
  maxVelocity: number;
  hitsByLimb: {
    brazo_derecho: number;
    brazo_izquierdo: number;
    pierna_derecha: number;
    pierna_izquierda: number;
  };
}

interface CompetitorPanelProps {
  competitor: Competitor | null;
  stats: CompetitorStats;
  events: CombatEvent[];
  isCompetitor1: boolean;
  teamColor: 'red' | 'blue';
}

const CompetitorPanel: React.FC<CompetitorPanelProps> = ({
  competitor,
  stats,
  events,
  isCompetitor1,
  teamColor,
}) => {
  const formatValue = (value: number, unit: string, decimals: number = 2) => {
    return `${value.toFixed(decimals)} ${unit}`;
  };

  return (
    <Card
      className={`border ${teamColor === 'red' ? 'border-red-500/30' : 'border-blue-500/30'} bg-zinc-800/50`}
    >
      <CardBody className="p-6">
        {/* Competitor Header */}
        <div className="mb-6 flex items-center gap-4">
          <CompetitorAvatar
            competitor={competitor}
            teamColor={teamColor}
            size="md"
          />
          <div>
            <h3 className="text-lg font-bold text-white">
              {competitor?.name || 'Competidor'}
            </h3>
            <p
              className={`text-sm ${teamColor === 'red' ? 'text-red-400' : 'text-blue-400'}`}
            >
              Competidor {teamColor === 'red' ? 'Rojo' : 'Azul'}
            </p>
          </div>
          <div className="ml-auto">
            <Badge
              content={stats.totalHits}
              color={teamColor === 'red' ? 'danger' : 'primary'}
            >
              <Zap
                size={24}
                className={
                  teamColor === 'red' ? 'text-red-400' : 'text-blue-400'
                }
              />
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {stats.totalHits}
            </div>
            <div className="text-xs text-zinc-400">Golpes Totales</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatValue(stats.maxForce, 'N')}
            </div>
            <div className="text-xs text-zinc-400">Máxima Fuerza</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatValue(stats.maxVelocity, 'm/s')}
            </div>
            <div className="text-xs text-zinc-400">Máxima Velocidad</div>
          </div>
        </div>

        {/* Limb Stats */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <div className={`rounded-full p-2 shadow-lg ${
              teamColor === 'red' 
                ? 'bg-gradient-to-br from-red-500/30 to-red-600/20 shadow-red-500/25' 
                : 'bg-gradient-to-br from-blue-500/30 to-blue-600/20 shadow-blue-500/25'
            }`}>
              <Zap size={16} className={
                teamColor === 'red' ? 'text-red-300' : 'text-blue-300'
              } />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Golpes por Extremidad
            </h4>
            <div className="ml-auto">
              <Chip
                size="sm"
                variant="flat"
                color={teamColor === 'red' ? 'danger' : 'primary'}
                className="text-xs"
              >
                Total: {stats.totalHits}
              </Chip>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* Arms Section */}
            <motion.div 
              className="group rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-900/40 to-zinc-800/30 p-3 transition-all duration-300 hover:border-orange-500/40 hover:bg-gradient-to-br hover:from-orange-900/10 hover:to-zinc-800/50 hover:shadow-lg hover:shadow-orange-500/10"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-orange-500/20 p-1.5 shadow-sm">
                  <Hand size={14} className="text-orange-400" />
                </div>
                <span className="text-xs font-semibold text-zinc-200">Brazos</span>
                <div className="ml-auto">
                  <span className="text-xs font-bold text-orange-400">
                    {stats.hitsByLimb.brazo_derecho + stats.hitsByLimb.brazo_izquierdo}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-xs text-zinc-400">Derecho</span>
                    <Progress
                      value={Math.min((stats.hitsByLimb.brazo_derecho / Math.max(stats.totalHits, 1)) * 100, 100)}
                      color={teamColor === 'red' ? 'danger' : 'primary'}
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={teamColor === 'red' ? 'danger' : 'primary'}
                    className="min-w-[40px]"
                  >
                    {stats.hitsByLimb.brazo_derecho}
                  </Chip>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-xs text-zinc-400">Izquierdo</span>
                    <Progress
                      value={Math.min((stats.hitsByLimb.brazo_izquierdo / Math.max(stats.totalHits, 1)) * 100, 100)}
                      color={teamColor === 'red' ? 'danger' : 'primary'}
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={teamColor === 'red' ? 'danger' : 'primary'}
                    className="min-w-[40px]"
                  >
                    {stats.hitsByLimb.brazo_izquierdo}
                  </Chip>
                </div>
              </div>
            </motion.div>

            {/* Legs Section */}
            <motion.div 
              className="group rounded-lg border border-zinc-700/50 bg-gradient-to-br from-zinc-900/40 to-zinc-800/30 p-3 transition-all duration-300 hover:border-green-500/40 hover:bg-gradient-to-br hover:from-green-900/10 hover:to-zinc-800/50 hover:shadow-lg hover:shadow-green-500/10"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-green-500/20 p-1.5 shadow-sm">
                  <Footprints size={14} className="text-green-400" />
                </div>
                <span className="text-xs font-semibold text-zinc-200">Piernas</span>
                <div className="ml-auto">
                  <span className="text-xs font-bold text-green-400">
                    {stats.hitsByLimb.pierna_derecha + stats.hitsByLimb.pierna_izquierda}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-xs text-zinc-400">Derecha</span>
                    <Progress
                      value={Math.min((stats.hitsByLimb.pierna_derecha / Math.max(stats.totalHits, 1)) * 100, 100)}
                      color={teamColor === 'red' ? 'danger' : 'primary'}
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={teamColor === 'red' ? 'danger' : 'primary'}
                    className="min-w-[40px]"
                  >
                    {stats.hitsByLimb.pierna_derecha}
                  </Chip>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="text-xs text-zinc-400">Izquierda</span>
                    <Progress
                      value={Math.min((stats.hitsByLimb.pierna_izquierda / Math.max(stats.totalHits, 1)) * 100, 100)}
                      color={teamColor === 'red' ? 'danger' : 'primary'}
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={teamColor === 'red' ? 'danger' : 'primary'}
                    className="min-w-[40px]"
                  >
                    {stats.hitsByLimb.pierna_izquierda}
                  </Chip>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-zinc-300">
            Eventos Recientes
          </h4>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {events.slice(0, 5).map(event => (
                <EventItem
                  key={`${event.timestamp}-${event.fighter_id}-${event.event_type}`}
                  event={event}
                  isCompetitor1={isCompetitor1}
                />
              ))}
            </AnimatePresence>
            {events.length === 0 && (
              <div className="py-4 text-center text-zinc-500">
                No hay eventos aún
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CompetitorPanel;
