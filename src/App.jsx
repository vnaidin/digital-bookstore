import React, { useReducer } from 'react';
import axios from 'axios';
import Footer from './layout/Footer';
import { AppStateProvider } from './appContext';
import { initialState, reducer } from './store/reducer';
import AppRouter from './Routers/Router';
import { InfoToast } from './components';
import './utils/axios';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // FIXME: replace it into axios.js but how to dispatch?
  axios.interceptors.response.use((response) => response, (error) => {
    // validate response
    if (error.response?.status === 401) {
      dispatch({ type: 'logOut' });
      localStorage.removeItem('user');
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
