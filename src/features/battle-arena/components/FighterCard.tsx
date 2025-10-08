import { Card, CardBody, Chip, Image } from '@heroui/react';

import { cmToFeetInches, imc, kgToLbs } from '@utils/measurementUtils';
import { nationalities } from '@features/fighters/components/filters/filterData';
import { Competitor, TeamColor } from '../types';

type LayoutType = 'horizontal' | 'vertical';

interface Props {
  competitor: Competitor | null;
  teamColor: TeamColor;
  borderColor: string;
  bgColor: string;
  shadowColor: string;
  layout?: LayoutType;
}

const FighterCard: React.FC<Props> = ({
  competitor,
  teamColor,
  borderColor,
  bgColor,
  shadowColor,
  layout = 'horizontal',
}) => {
  const nationality = nationalities.find(
    n => n.key === competitor?.country.toLowerCase(),
  );

  const containerClasses =
    layout === 'horizontal'
      ? 'flex items-center justify-between'
      : 'flex flex-col items-center text-center space-y-4';

  const imageContainerClasses =
    layout === 'horizontal' ? 'flex' : 'flex flex-col items-center';

  const imageClasses =
    layout === 'horizontal'
      ? 'h-40 w-32 rounded-xl object-cover shadow-xl'
      : 'h-48 w-36 rounded-xl object-cover shadow-xl mb-4';

  const infoClasses =
    layout === 'horizontal' ? 'ml-4' : 'flex flex-col items-center';

  const statsClasses =
    layout === 'horizontal'
      ? 'w-40 items-center space-y-8 text-sm'
      : 'w-full space-y-4 text-sm mt-4';

  const cardWidthClasses =
    layout === 'horizontal' ? 'w-full max-w-2xl' : 'w-full max-w-md';

  return (
    <Card
      className={`${cardWidthClasses} border-2 ${borderColor} ${bgColor} shadow-2xl ${shadowColor}`}
    >
      <CardBody className="p-6">
        <div className={containerClasses}>
          <div className={imageContainerClasses}>
            <Image
              src={competitor?.photoUrl}
              alt={competitor?.name}
              className={imageClasses}
              title={competitor?.name ?? 'Foto del luchador'}
            />

            <div className={infoClasses}>
              <h3
                className={`mb-2 text-xl font-bold text-white ${layout === 'vertical' ? 'text-center' : ''}`}
              >
                {competitor?.name}
              </h3>

              <Chip
                size="md"
                variant="solid"
                className={`mb-4 font-bold text-white ${teamColor === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}
              >
                {teamColor === 'red' ? 'Competidor Rojo' : 'Competidor Azul'}
              </Chip>

              <div
                className={`text-sm font-bold text-white ${layout === 'vertical' ? 'flex items-center justify-center' : ''}`}
              >
                <img
                  src={nationality?.icon}
                  alt={`${nationality?.label} flag`}
                  className="inline-block h-5 w-7 rounded-sm object-contain"
                  aria-hidden="true"
                />
                <span className="ml-2">{nationality?.label}</span>
              </div>
            </div>
          </div>

          <div className={statsClasses}>
            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Peso:</span>
              <span className="font-bold text-white">
                {competitor?.weight} kg ({kgToLbs(competitor?.weight || 75)}{' '}
                lbs)
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">Altura:</span>
              <span className="font-bold text-white">
                {competitor?.height} cm (
                {cmToFeetInches(competitor?.height || 180)})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-zinc-400">IMC:</span>
              <span className="font-bold text-success-400">
                {imc(competitor?.weight || 50, competitor?.height || 150)}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FighterCard;
