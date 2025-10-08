import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Home, Sword, Trophy } from 'lucide-react';
import { Navbar } from '@heroui/react';

import { MenuItem } from '@app-types/navigation';
import Logo from '../Logo';
import NavigationMenu from './NavigationMenu';

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'home',
    label: 'Inicio',
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
    key: 'battle-arena',
    label: 'Arena de Combate',
    path: '/battle-arena',
    icon: <Trophy size={18} />,
  },
];

interface Props {
  className?: string;
}

const Navigation: React.FC<Props> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = useCallback(
    (item: MenuItem) => {
      navigate(item.path);
      setIsMenuOpen(false);
    },
    [navigate],
  );

  const currentPath = location.pathname;
  const currentItem = MENU_ITEMS.find(item => item.path === currentPath);
  const currentPage = currentItem?.key || 'home';

  /* const getCurrentPage = useCallback(() => {
    const currentPath = location.pathname;
    const currentItem = MENU_ITEMS.find(item => item.path === currentPath);
    return currentItem?.key || 'home';
  }, [location.pathname]);

  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [getCurrentPage]); */

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
