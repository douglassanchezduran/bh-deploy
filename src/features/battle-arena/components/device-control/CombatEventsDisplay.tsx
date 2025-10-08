import { Card, CardBody, Chip, Badge, Divider } from '@heroui/react';
import { useBLEStore } from '@stores/useBLEStore';
import useBattleStore from '../../stores/useBattleStore';

interface CombatEventsDisplayProps {
  maxEventsPerCompetitor?: number;
  className?: string;
}

const CombatEventsDisplay: React.FC<CombatEventsDisplayProps> = ({
  maxEventsPerCompetitor = 5,
  className = '',
}) => {
  // Store BLE
  const getCompetitor1Events = useBLEStore(state => state.getCompetitor1Events);
  const getCompetitor2Events = useBLEStore(state => state.getCompetitor2Events);
  const getConnectedDevicesCount = useBLEStore(
    state => state.getConnectedDevicesCount,
  );
  const combatEvents = useBLEStore(state => state.combatEvents);

  const competitor1 = useBattleStore(state => state.competitor1);
  const competitor2 = useBattleStore(state => state.competitor2);

  const competitor1Events = getCompetitor1Events().slice(
    0,
    maxEventsPerCompetitor,
  );
  const competitor2Events = getCompetitor2Events().slice(
    0,
    maxEventsPerCompetitor,
  );

  const getEventIcon = (eventType: string) => {
    const eventTypeIcons = {
      slap: '👋',
      low_kick: '🦵',
    };

    return eventTypeIcons[eventType as keyof typeof eventTypeIcons] ?? '💥';
  };

  const getEventColor = (eventType: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    const eventTypeColors = {
      slap: 'warning' as const,
      low_kick: 'secondary' as const,
    };

    return (
      eventTypeColors[eventType as keyof typeof eventTypeColors] ?? 'default'
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatValue = (value: number, unit: string, decimals: number = 1) => {
    return `${value.toFixed(decimals)} ${unit}`;
  };

  const renderEventCard = (event: any, index: number) => (
    <Card
      key={`${event.timestamp}-${index}`}
      className="border-zinc-700 bg-zinc-800/50 transition-colors hover:bg-zinc-800/70"
    >
      <CardBody className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{getEventIcon(event.event_type)}</span>
            <div>
              <div className="flex items-center space-x-2">
                <Chip
                  size="sm"
                  color={getEventColor(event.event_type)}
                  variant="flat"
                >
                  {event.event_type.toUpperCase()}
                </Chip>
                <span className="text-xs font-medium text-zinc-200">
                  {event.limb_name}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-zinc-400">
              {formatTimestamp(event.timestamp)}
            </p>
            <Chip
              size="sm"
              color={
                event.confidence > 0.8
                  ? 'success'
                  : event.confidence > 0.6
                    ? 'warning'
                    : 'danger'
              }
              variant="dot"
            >
              {Math.round(event.confidence * 100)}%
            </Chip>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 border-t border-zinc-700 pt-2">
          <div className="text-center">
            <p className="text-xs text-zinc-400">Velocidad</p>
            <p className="text-xs font-medium text-zinc-200">
              {formatValue(event.velocity, 'm/s')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-400">Aceleración</p>
            <p className="text-xs font-medium text-zinc-200">
              {formatValue(event.acceleration, 'm/s²')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-400">Fuerza</p>
            <p className="text-xs font-medium text-zinc-200">
              {formatValue(event.force, 'N')}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderCompetitorSection = (
    competitorName: string,
    events: any[],
    competitorColor: 'primary' | 'secondary',
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Chip size="sm" color={competitorColor} variant="flat">
            {competitorName}
          </Chip>
          <Badge content={events.length} color={competitorColor} size="sm">
            <span className="text-xs text-zinc-400">Eventos</span>
          </Badge>
        </div>
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {events.length === 0 ? (
          <Card className="border-zinc-700 bg-zinc-800/30">
            <CardBody className="py-4 text-center">
              <div className="text-zinc-500">
                <span className="mb-1 block text-2xl">👋🦵</span>
                <p className="text-xs">Sin eventos</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          events.map((event, index) => renderEventCard(event, index))
        )}
      </div>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">
          Eventos por Competidor
        </h3>
        <div className="flex items-center space-x-2">
          <Badge content={getConnectedDevicesCount()} color="success" size="sm">
            <Chip size="sm" variant="flat" color="default">
              Dispositivos
            </Chip>
          </Badge>
          <Badge content={combatEvents.length} color="primary" size="sm">
            <Chip size="sm" variant="flat" color="default">
              Total Eventos
            </Chip>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Competidor 1 */}
        {renderCompetitorSection(
          competitor1?.name || 'Competidor 1',
          competitor1Events,
          'primary',
        )}

        {/* Competidor 2 */}
        {renderCompetitorSection(
          competitor2?.name || 'Competidor 2',
          competitor2Events,
          'secondary',
        )}
      </div>

      {/* Resumen total */}
      <Divider className="bg-zinc-700" />
      <div className="flex justify-center space-x-4 text-xs text-zinc-400">
        <span>
          Total {competitor1?.name || 'Competidor 1'}:{' '}
          {getCompetitor1Events().length}
        </span>
        <span>•</span>
        <span>
          Total {competitor2?.name || 'Competidor 2'}:{' '}
          {getCompetitor2Events().length}
        </span>
      </div>
    </div>
  );
};

export default CombatEventsDisplay;
