import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';

import App from './App';
import { store } from './store';
import { theme } from './theme';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import './index.css';
import './utils/i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Suspense fallback={<div style={{ minHeight: '95vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />}>
          <App />
        </Suspense>
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
);
