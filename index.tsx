import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// ===== PUNTO DE ENTRADA DE LA APLICACIÓN =====
// Este es el primer archivo que se ejecuta cuando se carga la app

// Obtiene el elemento HTML donde se montará React (definido en public/index.html)
const rootElement = document.getElementById('root');

// Valida que el elemento exista (buena práctica para TypeScript)
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// ===== CREACIÓN DEL ROOT DE REACT 18+ =====
// React 18 usa createRoot (antes era ReactDOM.render)
const root = ReactDOM.createRoot(rootElement);

// ===== RENDERIZADO DE LA APLICACIÓN =====
root.render(
  // StrictMode: Modo estricto de React que ayuda a detectar problemas
  // - Ejecuta efectos dos veces en desarrollo (para detectar efectos impuros)
  // - Advierte sobre APIs obsoletas
  // - Solo afecta en desarrollo, no en producción
  <React.StrictMode>
    {/* ===== ROUTER: MANEJO DE RUTAS ===== */}
    {/* HashRouter: Usa el hash (#) en la URL para las rutas */}
    {/* Ejemplo: https://miapp.com/#/category/pasteles */}
    {/* Se usa en lugar de BrowserRouter porque funciona mejor en hosting estático */}
    {/* (no requiere configuración del servidor para redirigir todas las rutas) */}
    <HashRouter>
      {/* ===== PROVIDER DE AUTENTICACIÓN ===== */}
      {/* AuthProvider: Envuelve la app para proveer el estado de autenticación */}
      {/* Debe estar fuera de App pero dentro del Router */}
      <AuthProvider>
        {/* ===== COMPONENTE PRINCIPAL ===== */}
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);

/* ===== JERARQUÍA DE PROVIDERS =====

index.tsx (punto de entrada)
└── StrictMode (modo estricto de React)
    └── HashRouter (sistema de rutas)
        └── AuthProvider (autenticación global)
            └── App.tsx
                └── CartProvider (carrito global)
                    └── DataProvider (datos globales)
                        └── Componentes de la app

ORDEN IMPORTANTE:
1. Router debe estar antes de cualquier componente que use navegación
2. AuthProvider debe estar dentro del Router pero fuera de App
3. CartProvider y DataProvider están dentro de App
*/

/* ===== ¿POR QUÉ HashRouter EN LUGAR DE BrowserRouter? =====

BrowserRouter:
- URLs limpias: https://miapp.com/category/pasteles
- Requiere configuración del servidor (redireccionar todas las rutas al index.html)
- No funciona bien en GitHub Pages o hosting estático simple

HashRouter:
- URLs con hash: https://miapp.com/#/category/pasteles
- Funciona en cualquier servidor sin configuración
- Ideal para hosting estático (GitHub Pages, Netlify, etc.)
- El hash (#) indica al navegador que todo después es manejado por JavaScript

PARA DEFENSA: "Usamos HashRouter porque el proyecto está deployado en hosting estático
y no requeríamos configuración adicional del servidor. El # en la URL es un trade-off
aceptable para simplificar el deployment."
*/