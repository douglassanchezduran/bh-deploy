import React from 'react';
import { Route, Routes } from 'react-router';

import RootLayout from '@layout/RootLayout';
import HomeScreen from '@features/home/HomeScreen';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomeScreen />} />
      </Route>
    </Routes>
  );
};

export default App;
