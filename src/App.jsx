import React, { useReducer } from 'react';

import './App.css';
import Footer from './layout/Footer';

import { AppStateProvider } from './appContext';
import { initialState, reducer } from './store/reducer';
import AppRouter from './Routers/Router';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <AppStateProvider value={{
        state,
        dispatch,
      }}
      >
        <AppRouter />
      </AppStateProvider>
      <Footer />
    </div>
  );
}

export default App;
