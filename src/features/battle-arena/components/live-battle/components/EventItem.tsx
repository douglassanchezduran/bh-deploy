import React from 'react';
import { Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import type { CombatEvent } from '@features/battle-arena/types';

interface EventItemProps {
  event: CombatEvent;
  isCompetitor1: boolean;
}

const EventItem = React.forwardRef<HTMLDivElement, EventItemProps>(
  ({ event, isCompetitor1 }, ref) => {
    const getEventIcon = (eventType: string) => {
      switch (eventType) {
        case 'slap':
          return '👋';
        case 'low_kick':
          return '🦵';
        default:
          return '💥';
      }
    };

    const getEventColor = (eventType: string) => {
      switch (eventType) {
        case 'slap':
          return 'warning';
        case 'low_kick':
          return 'secondary';
        default:
          return 'primary';
      }
    };

    const formatValue = (value: number, unit: string, decimals: number = 2) => {
      return `${value.toFixed(decimals)} ${unit}`;
    };

    return (
      <motion.div
        ref={ref}
        layoutId={`event-${event.timestamp}-${event.fighter_id}`}
        initial={{ opacity: 0, x: isCompetitor1 ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isCompetitor1 ? -20 : 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`flex items-center gap-3 rounded-lg border p-3 ${
          isCompetitor1
            ? 'border-red-500/30 bg-red-900/20'
            : 'border-blue-500/30 bg-blue-900/20'
        }`}
      >
        <div className="text-2xl">{getEventIcon(event.event_type)}</div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Chip size="sm" color={getEventColor(event.event_type)}>
              {event.event_type}
            </Chip>
            <span className="text-xs text-zinc-400">{event.limb_name}</span>
          </div>
          <div className="mt-1 flex gap-4 text-xs text-zinc-500">
            {event.force && (
              <span>Fuerza: {formatValue(event.force, 'N')}</span>
            )}
            {event.velocity && (
              <span>Velocidad: {formatValue(event.velocity, 'm/s')}</span>
            )}
            {event.acceleration && (
              <span>
                Aceleración: {formatValue(event.acceleration, 'm/s²')}
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-zinc-400">
          {new Date(event.timestamp).toLocaleTimeString()}
        </div>
      </motion.div>
    );
  },
);

export default EventItem;
