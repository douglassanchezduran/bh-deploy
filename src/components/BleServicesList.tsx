import React, { useState } from 'react';
import { useBluetoothStore } from '../shared/stores/bluetooth';
import {
  Card,
  CardBody,
  CardHeader,
  Accordion,
  AccordionItem,
  Chip,
  Spinner,
  Divider,
  Badge,
} from '@heroui/react';
import { ChevronDown, ChevronUp, Battery } from 'lucide-react';

export const BleServicesList: React.FC = () => {
  const { deviceServices, loadingServices, connectedDeviceId, batteryLevels } =
    useBluetoothStore();
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );

  const toggleService = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  if (loadingServices) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="sm" color="primary" />
        <span className="ml-2 text-zinc-300">Descubriendo servicios...</span>
      </div>
    );
  }

  if (!connectedDeviceId) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardBody>
          <p className="text-zinc-300">
            Conecta un dispositivo para ver sus servicios
          </p>
        </CardBody>
      </Card>
    );
  }

  if (deviceServices.length === 0 && !loadingServices) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700">
        <CardBody>
          <p className="text-zinc-300">
            No se encontraron servicios en el dispositivo conectado
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {deviceServices.map(device => (
        <Card key={device.id} className="mb-4 bg-zinc-800/50 border-zinc-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h4 className="text-zinc-200 font-semibold">
                {device.name || 'Dispositivo sin nombre'}
                <span className="text-xs text-zinc-400 ml-2">
                  ({formatUuid(device.id)})
                </span>
              </h4>
              {batteryLevels[device.id] !== undefined && (
                <div className="flex items-center gap-1 text-zinc-200">
                  <Battery size={16} />
                  <Badge
                    color={getBatteryColor(batteryLevels[device.id])}
                    variant="flat"
                    className="text-xs"
                  >
                    {batteryLevels[device.id]}%
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <Accordion
              variant="splitted"
              className="gap-2"
              selectionMode="multiple"
            >
              {device.services.map(service => (
                <AccordionItem
                  key={service.uuid}
                  aria-label={`Servicio ${formatUuid(service.uuid)}`}
                  title={
                    <div className="flex justify-between items-center w-full">
                      <span className="text-zinc-200">
                        Servicio: {formatUuid(service.uuid)}
                      </span>
                      <Chip
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="ml-2"
                        onClick={e => {
                          e.stopPropagation();
                          toggleService(service.uuid);
                        }}
                      >
                        {service.characteristics.length} características
                      </Chip>
                    </div>
                  }
                  indicator={({ isOpen }) =>
                    isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  }
                  classNames={{
                    base: 'bg-zinc-800/70 border-zinc-700',
                    heading: 'bg-zinc-800/70 hover:bg-zinc-700/50',
                    trigger: 'px-3 py-2',
                    content: 'px-3 py-2',
                  }}
                >
                  <div className="space-y-2 mt-2">
                    {service.characteristics.map(characteristic => (
                      <div
                        key={characteristic.uuid}
                        className="p-2 border border-zinc-700 rounded-md bg-zinc-800/50 hover:bg-zinc-700/30"
                      >
                        <p className="text-sm font-medium text-zinc-200">
                          {formatUuid(characteristic.uuid)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {characteristic.can_read && (
                            <Chip size="sm" color="success" variant="flat">
                              Lectura
                            </Chip>
                          )}
                          {characteristic.can_write && (
                            <Chip size="sm" color="primary" variant="flat">
                              Escritura
                            </Chip>
                          )}
                          {characteristic.can_notify && (
                            <Chip size="sm" color="secondary" variant="flat">
                              Notificación
                            </Chip>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Propiedades: {characteristic.properties.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

// Función para formatear UUIDs para mejor visualización
const formatUuid = (uuid: string): string => {
  // Si es un UUID estándar, intenta mostrar una versión más corta
  if (uuid.length > 8) {
    return `${uuid.substring(0, 8)}...`;
  }
  return uuid;
};

// Función para determinar el color del indicador de batería según el nivel
const getBatteryColor = (level: number): 'success' | 'warning' | 'danger' => {
  if (level > 50) return 'success';
  if (level > 20) return 'warning';
  return 'danger';
};

export default BleServicesList;
