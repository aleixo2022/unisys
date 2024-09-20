import React from 'react';
import  './assets/styles/global.css';
import { FlashProvider } from './components/contexts/FlashContext';
import { store, persistor } from './store/store';
import { Provider } from 'react-redux'; // Importar o Provider do react-redux
import { PersistGate } from 'redux-persist/integration/react'; // Importar o PersistGate
import {PrincipalRoutes } from './routes';


 
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FlashProvider>
            <PrincipalRoutes />
        </FlashProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
