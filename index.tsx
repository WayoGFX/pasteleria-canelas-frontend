import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

//este es el primer archivo que se ejecuta cuando se carga
// obtiene el elemento HTML donde se montará React
const rootElement = document.getElementById('root');

// valida que el elemento exista
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// createRoot
const root = ReactDOM.createRoot(rootElement);

// RENDERIZADO DE TODO
root.render(
  <React.StrictMode>
    <HashRouter>
      {/* AuthProvider es ek que envuelve la app para proveer el estado de autenticación */}
      <AuthProvider>
        {/*COMPONENTE PRINCIPAL*/}
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);