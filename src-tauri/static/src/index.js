import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import './stores/useWebSocketStore';

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));
