import React from 'react';

const AppContext = React.createContext({

});

AppContext.displayName = 'AppContext';

export const AppStateProvider = AppContext.Provider;

export default AppContext;
