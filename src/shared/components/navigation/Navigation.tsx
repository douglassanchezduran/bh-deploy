import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, Sword, Trophy } from 'lucide-react';
import { Navbar } from '@heroui/react';

import { MenuItem } from '@app-types/navigation';
import Logo from '../Logo';
import NavigationMenu from './NavigationMenu';

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    path: '/',
    icon: <Home size={18} />,
  },
  {
    key: 'fighters',
    label: 'Competidores',
    path: '/fighters',
    icon: <Sword size={18} />,
  },
  {
    key: 'combat',
    label: 'Arena de Combate',
    path: '/combat',
    icon: <Trophy size={18} />,
  },
];

interface Props {
  className?: string;
}

const Navigation: React.FC<Props> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (item: MenuItem) => {
    navigate(item.path);
    setIsMenuOpen(false);
  };

  const getCurrentPage = () => {
    const currentPath = location.pathname;
    const currentItem = MENU_ITEMS.find(item => item.path === currentPath);
    return currentItem?.key || 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      maxWidth="full"
      height="100px"
      className={`border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur-lg ${className}`}
      classNames={{
        wrapper: 'px-4 sm:px-6 lg:px-8 h-24',
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
    >
      <Logo />

      <NavigationMenu
        menuItems={MENU_ITEMS}
        currentPage={currentPage}
        handleNavigation={handleNavigation}
      />
    </Navbar>
  );
};

export default Navigation;
