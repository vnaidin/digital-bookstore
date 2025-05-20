import React, { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import './utils/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={(
      <div
        style={{ minHeight: '95vh', backgroundColor: 'var(--bs-body-bg)' }}
        className="d-flex justify-content-center align-items-center"
      >
        <Spinner animation="border">
          {/* <img src="logo16.svg" alt="logo" width={160} /> */}
        </Spinner>
      </div>
      )}
    >
      <App />
    </Suspense>
  </React.StrictMode>,
);
