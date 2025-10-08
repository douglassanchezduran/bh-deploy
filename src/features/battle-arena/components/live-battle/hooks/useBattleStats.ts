import { useState, useEffect } from 'react';
import type { CombatEvent } from '@features/battle-arena/types';

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

interface UseBattleStatsProps {
  combatEvents: CombatEvent[];
  getCompetitor1Events: () => CombatEvent[];
  getCompetitor2Events: () => CombatEvent[];
}

export const useBattleStats = ({
  combatEvents,
  getCompetitor1Events,
  getCompetitor2Events,
}: UseBattleStatsProps) => {
  const [competitor1Stats, setCompetitor1Stats] = useState<CompetitorStats>({
    totalHits: 0,
    maxForce: 0,
    maxAcceleration: 0,
    maxVelocity: 0,
    hitsByLimb: {
      brazo_derecho: 0,
      brazo_izquierdo: 0,
      pierna_derecha: 0,
      pierna_izquierda: 0,
    },
  });

  const [competitor2Stats, setCompetitor2Stats] = useState<CompetitorStats>({
    totalHits: 0,
    maxForce: 0,
    maxAcceleration: 0,
    maxVelocity: 0,
    hitsByLimb: {
      brazo_derecho: 0,
      brazo_izquierdo: 0,
      pierna_derecha: 0,
      pierna_izquierda: 0,
    },
  });

  // Update stats from combat events
  useEffect(() => {
    const competitor1Events = getCompetitor1Events();
    const competitor2Events = getCompetitor2Events();

    // Update competitor 1 stats
    const c1Stats: CompetitorStats = {
      totalHits: competitor1Events.length,
      maxForce: Math.max(...competitor1Events.map(e => e.force || 0), 0),
      maxAcceleration: Math.max(
        ...competitor1Events.map(e => e.acceleration || 0),
        0,
      ),
      maxVelocity: Math.max(...competitor1Events.map(e => e.velocity || 0), 0),
      hitsByLimb: {
        brazo_derecho: competitor1Events.filter(
          e =>
            e.limb_name?.includes('Mano') && e.limb_name?.includes('Derecha'),
        ).length,
        brazo_izquierdo: competitor1Events.filter(
          e =>
            e.limb_name?.includes('Mano') && e.limb_name?.includes('Izquierda'),
        ).length,
        pierna_derecha: competitor1Events.filter(
          e => e.limb_name?.includes('Pie') && e.limb_name?.includes('Derecho'),
        ).length,
        pierna_izquierda: competitor1Events.filter(
          e =>
            e.limb_name?.includes('Pie') && e.limb_name?.includes('Izquierdo'),
        ).length,
      },
    };

    // Update competitor 2 stats
    const c2Stats: CompetitorStats = {
      totalHits: competitor2Events.length,
      maxForce: Math.max(...competitor2Events.map(e => e.force || 0), 0),
      maxAcceleration: Math.max(
        ...competitor2Events.map(e => e.acceleration || 0),
        0,
      ),
      maxVelocity: Math.max(...competitor2Events.map(e => e.velocity || 0), 0),
      hitsByLimb: {
        brazo_derecho: competitor2Events.filter(
          e =>
            e.limb_name?.includes('Mano') && e.limb_name?.includes('Derecha'),
        ).length,
        brazo_izquierdo: competitor2Events.filter(
          e =>
            e.limb_name?.includes('Mano') && e.limb_name?.includes('Izquierda'),
        ).length,
        pierna_derecha: competitor2Events.filter(
          e => e.limb_name?.includes('Pie') && e.limb_name?.includes('Derecho'),
        ).length,
        pierna_izquierda: competitor2Events.filter(
          e =>
            e.limb_name?.includes('Pie') && e.limb_name?.includes('Izquierdo'),
        ).length,
      },
    };

    setCompetitor1Stats(c1Stats);
    setCompetitor2Stats(c2Stats);
  }, [combatEvents, getCompetitor1Events, getCompetitor2Events]);

  return {
    competitor1Stats,
    competitor2Stats,
  };
};

export type { CompetitorStats };
