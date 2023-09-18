import React, { useReducer } from 'react';
import axios from 'axios';
import Footer from './layout/Footer';
import { AppStateProvider } from './appContext';
import { initialState, reducer } from './store/reducer';
import AppRouter from './Routers/Router';
import InfoToast from './components/InfoToast/InfoToast';

import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { REACT_APP_BE_URL } = process.env;
  axios.defaults.baseURL = REACT_APP_BE_URL;
  // validate response
  axios.interceptors.response.use((response) => response, (error) => {
    if (error.response.status === 401) {
      dispatch({ type: 'logOut' });
      sessionStorage.removeItem('user');
    }
    return Promise.reject(error);
  });

  return (
    <div className="App">
      <AppStateProvider value={{
        state,
        dispatch,
      }}
      >
        <AppRouter />
        {state.toast !== null && <InfoToast />}
      </AppStateProvider>
      <Footer />
    </div>
  );
}

export default App;
