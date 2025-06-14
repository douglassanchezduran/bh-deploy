import React from 'react';
import { Button, NavbarContent, NavbarItem } from '@heroui/react';

import { MenuItem } from '@app-types/navigation';

interface Props {
  menuItems: MenuItem[];
  currentPage: string;
  handleNavigation: (item: MenuItem) => void;
}

const NavigationMenu: React.FC<Props> = ({
  menuItems,
  currentPage,
  handleNavigation,
}) => {
  const handlePress = (item: MenuItem) => () => {
    handleNavigation(item);
  };

  return (
    <NavbarContent className="hidden gap-4 sm:flex" justify="center">
      {menuItems.map(item => (
        <NavbarItem key={item.key} isActive={currentPage === item.key}>
          <Button
            variant={currentPage === item.key ? 'solid' : 'light'}
            color={currentPage === item.key ? 'primary' : 'default'}
            size="md"
            startContent={item.icon}
            className={`h-10 min-w-[140px] font-medium transition-all duration-300 ${
              currentPage === item.key
                ? 'bg-primary-500 text-white shadow-lg hover:bg-primary-600'
                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
            } `}
            onPress={handlePress(item)}
          >
            {item.label}
          </Button>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
};

export default NavigationMenu;
