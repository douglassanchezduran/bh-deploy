import React from 'react';
import { Route, Routes } from 'react-router';

import RootLayout from '@layout/RootLayout';
import HomeScreen from '@features/home/HomeScreen';
import FighterScreen from '@features/fighters/FighterScreen';
import BattleArenaScreen from '@features/battle-arena/BattleArenaScreen';

const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomeScreen />} />
        <Route path="/fighters" element={<FighterScreen />} />
        <Route path="/battle-arena" element={<BattleArenaScreen />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
