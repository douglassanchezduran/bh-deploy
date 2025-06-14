import React from 'react';
import { Outlet } from 'react-router';

import { Navigation } from '@components/navigation';

const RootLayout: React.FC = () => {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      <Outlet />
    </main>
  );
};

export default RootLayout;
