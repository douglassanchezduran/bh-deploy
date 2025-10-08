import { Button, Chip, Badge, Tooltip } from '@heroui/react';
import {
  Wifi,
  Search,
  CheckCircle,
  Circle,
  Zap,
  Hand,
  Footprints,
  AlertTriangle,
  Battery,
  BatteryLow,
} from 'lucide-react';

import { devSuccessLog } from '@utils/devLog';
import { useBLEStore } from '@stores/useBLEStore';
import { BleDevice, Competitor } from '../../types';

interface Props {
  competitor: Competitor | null;
  team: 'red' | 'blue';
  selectedDevices: BleDevice[];
  excludedDevices?: BleDevice[];
  onDeviceToggle: (device: BleDevice) => void;
  onConnectSelected: () => void;
  onDisconnectDevice?: (device: BleDevice) => void;
  isConnecting?: boolean;
}

const DeviceList: React.FC<Props> = ({
  competitor,
  team,
  selectedDevices,
  excludedDevices = [],
  onDeviceToggle,
  onConnectSelected,
  onDisconnectDevice,
  isConnecting = false,
}) => {
  // Store BLE
  const availableDevices = useBLEStore(state => state.availableDevices);
  const isScanning = useBLEStore(state => state.isScanning);
  const scanDevices = useBLEStore(state => state.scanDevices);
  const isDeviceConnected = useBLEStore(state => state.isDeviceConnected);

  if (!competitor) return null;

  const teamColor = team === 'red' ? 'danger' : 'primary';
  const teamTextColor = team === 'red' ? 'text-red-400' : 'text-blue-400';
  const teamBorderColor = team === 'red' ? 'border-red-500' : 'border-blue-500';

  // Iconos de dispositivos por tipo de extremidad
  const getDeviceIcon = (limbType?: string, isConnected = false) => {
    const iconColor = isConnected ? 'text-green-500' : 'text-zinc-400';
    const iconProps = { size: 20, className: iconColor };

    if (!limbType) {
      return <AlertTriangle size={20} className="text-yellow-500" />;
    }

    const iconComponent = {
      LeftHand: <Hand {...iconProps} />,
      RightHand: <Hand {...iconProps} />,
      LeftFoot: <Footprints {...iconProps} />,
      RightFoot: <Footprints {...iconProps} />,
    };

    return iconComponent[limbType as keyof typeof iconComponent];
  };

  const getDeviceTypeColor = (
    limbType?: string,
  ): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
    if (!limbType) return 'warning';

    const limbTypeColor = {
      LeftHand: 'primary' as const,
      RightHand: 'primary' as const,
      LeftFoot: 'success' as const,
      RightFoot: 'success' as const,
    };

    return limbTypeColor[limbType as keyof typeof limbTypeColor] ?? 'warning';
  };

  // Icono de batería basado en el nivel
  const getBatteryIcon = (batteryLevel?: number) => {
    if (batteryLevel === undefined || batteryLevel === null) return null;

    const isLowBattery = batteryLevel <= 20;
    const iconColor = isLowBattery ? 'text-red-400' : 'text-green-400';
    const IconComponent = isLowBattery ? BatteryLow : Battery;

    return <IconComponent size={16} className={iconColor} />;
  };

  // Color del chip de batería
  const getBatteryColor = (batteryLevel?: number) => {
    if (batteryLevel === undefined || batteryLevel === null) return 'default';

    if (batteryLevel <= 20) return 'danger';
    if (batteryLevel <= 50) return 'warning';
    return 'success';
  };

  // Determina los estilos del botón basado en el estado del dispositivo
  const getButtonStyles = (
    isConnected: boolean,
    isSelected: boolean,
  ): {
    color: 'success' | 'danger' | 'primary' | 'default';
    className: string;
  } => {
    if (isConnected) {
      return {
        color: 'success',
        className: 'border-2 border-green-500 text-zinc-300',
      };
    }

    if (isSelected) {
      return {
        color: team === 'red' ? 'danger' : 'primary',
        className: `border-2 ${teamBorderColor} text-zinc-300`,
      };
    }

    return {
      color: 'default',
      className: `border-zinc-600 text-zinc-300 hover:${teamBorderColor} hover:text-white`,
    };
  };

  const handleScanDevices = async () => {
    try {
      await scanDevices();
    } catch (error) {
      console.error('Error escaneando dispositivos:', error);
    }
  };

  const isDeviceSelected = (device: BleDevice) => {
    const result = selectedDevices.some(d => d.id === device.id);
    devSuccessLog(
      `🔍 [${team.toUpperCase()}] Checking device ${device.name} (${device.id}):`,
      {
        isSelected: result,
        selectedDevicesCount: selectedDevices.length,
        selectedDeviceIds: selectedDevices.map(d => d.id),
        currentDeviceId: device.id,
      },
    );
    return result;
  };

  const isDeviceExcluded = (device: BleDevice) => {
    return excludedDevices.some(d => d.id === device.id);
  };

  const hasSelectedDevices = selectedDevices.length > 0;

  const connectedDevicesCount = selectedDevices.filter(device =>
    isDeviceConnected(device.id),
  ).length;

  const filteredAvailableDevices = availableDevices.filter(
    device => !isDeviceExcluded(device),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-zinc-100">
              Dispositivos BLE
            </h3>

            {connectedDevicesCount > 0 && (
              <Badge content={connectedDevicesCount} color="success" size="sm">
                <Zap size={16} className="text-green-400" />
              </Badge>
            )}
          </div>

          <p className={`text-sm ${teamTextColor}`}>
            {competitor.name} - Selecciona tus dispositivos
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            color={teamColor}
            variant="bordered"
            startContent={<Search size={16} />}
            onPress={handleScanDevices}
            isLoading={isScanning}
          >
            {isScanning ? 'Buscando...' : 'Escanear'}
          </Button>

          {hasSelectedDevices && (
            <Button
              size="sm"
              color={teamColor}
              variant="solid"
              onPress={onConnectSelected}
              isLoading={isConnecting}
            >
              {isConnecting ? 'Conectando...' : 'Conectar'} (
              {selectedDevices.length})
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium text-zinc-300">
              Disponibles: {filteredAvailableDevices.length}
            </p>

            {hasSelectedDevices && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-400">
                  Seleccionados: {selectedDevices.length}
                </p>
                {connectedDevicesCount > 0 && (
                  <Chip size="sm" color="success" variant="flat">
                    {connectedDevicesCount} conectados
                  </Chip>
                )}
              </div>
            )}
          </div>

          {excludedDevices.length > 0 && (
            <Tooltip
              content={`${excludedDevices.length} dispositivos en uso por el oponente`}
            >
              <p className="text-xs text-orange-400">
                {excludedDevices.length} en uso
              </p>
            </Tooltip>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredAvailableDevices.map(device => {
            const isSelected = isDeviceSelected(device);
            const isConnected = isDeviceConnected(device.id);
            const deviceTypeColor = getDeviceTypeColor(device.limb_type);
            const batteryIcon = getBatteryIcon(device.battery_level);
            const batteryColor = getBatteryColor(device.battery_level);
            const buttonStyles = getButtonStyles(isConnected, isSelected);

            return (
              <div key={device.id} className="relative">
                <Button
                  variant="bordered"
                  color={buttonStyles.color}
                  size="sm"
                  className={`h-20 w-full justify-start bg-transparent ${buttonStyles.className}`}
                  startContent={
                    <div className="flex items-center space-x-3">
                      {/* Icono de selección */}
                      {isSelected ? (
                        <CheckCircle
                          size={20}
                          className={
                            isConnected ? 'text-green-500' : teamTextColor
                          }
                        />
                      ) : (
                        <Circle size={20} className="text-zinc-400" />
                      )}

                      {/* Icono del dispositivo */}
                      {getDeviceIcon(device.limb_type, isConnected)}

                      {/* Estado de conexión */}
                      <div className="flex items-center space-x-2">
                        <Wifi
                          size={16}
                          className={
                            isConnected ? 'text-green-500' : 'text-zinc-400'
                          }
                        />

                        <div className="flex flex-col gap-1">
                          <Chip
                            size="sm"
                            color={isConnected ? 'success' : 'default'}
                            className="text-white"
                            variant="dot"
                          >
                            {isConnected ? 'Conectado' : 'Disponible'}
                          </Chip>

                          {/* Nivel de batería - solo si está disponible */}
                          {device.battery_level !== undefined && (
                            <Chip
                              size="sm"
                              color={batteryColor}
                              variant="flat"
                              startContent={batteryIcon}
                            >
                              {device.battery_level}%
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                  onPress={() => onDeviceToggle(device)}
                >
                  <div className="flex flex-1 flex-col items-start text-left">
                    {/* Tipo de dispositivo */}
                    <Chip size="sm" color={deviceTypeColor} variant="flat">
                      {device.limb_name || 'Desconocido'}
                    </Chip>

                    {device.rssi && (
                      <span className="text-xs text-zinc-500">
                        Señal: {device.rssi} dBm
                      </span>
                    )}
                  </div>
                </Button>

                {/* Botón de desconexión individual */}
                {isSelected && isConnected && onDisconnectDevice && (
                  <div className="absolute right-2 top-2">
                    <Tooltip content="Desconectar este dispositivo">
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isIconOnly
                        aria-label="Desconectar dispositivo"
                        className="h-6 w-6 min-w-6"
                        onPress={() => {
                          onDisconnectDevice(device);
                        }}
                      >
                        <Zap size={12} />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAvailableDevices.length === 0 && !isScanning && (
          <div className="py-8 text-center text-zinc-400">
            <Search size={48} className="mx-auto mb-2 opacity-50" />
            {availableDevices.length === 0 ? (
              <>
                <p>No se encontraron dispositivos</p>
                <p className="text-sm">
                  Presiona "Escanear" para buscar dispositivos BLE
                </p>
              </>
            ) : (
              <>
                <p>Todos los dispositivos están en uso</p>
                <p className="text-sm">
                  El oponente ha seleccionado todos los dispositivos disponibles
                </p>
              </>
            )}
          </div>
        )}

        {isScanning && (
          <div className="py-8 text-center text-zinc-400">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500"></div>
            <p>Escaneando dispositivos BLE...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceList;
