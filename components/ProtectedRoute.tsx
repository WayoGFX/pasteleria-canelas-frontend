// Protege rutas privadas del panel de administración.
// Bloquea el acceso y lo redirige al login

import React from 'react';
import { Navigate } from 'react-router-dom';  // para redirigir a otras páginas
import { useAuth } from '../context/AuthContext'; // para verificar autenticación

// Recibe otros componentes como children, agrega lógica antes de renderizarlos, y muestra o redirije
// es como un guarda que si isAuthenticated es true entonces entra de lo contrario no
// children son los componentes de administrador

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  // estado de autenticación
  // se inicia isAuthenticated | osea pregunta
  const { isAuthenticated } = useAuth();

  // verifica si es true si no entonces redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // PERMITIR ACCESO
  // si se llega a este punto es porque isAuthenticated = true
  // ya libera los demás componentes
  return children;
};

export default ProtectedRoute;

/*
import ProtectedRoute from './components/ProtectedRoute';
import AdminRouter from './components/admin/AdminRouter';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* proteger rutas del admin /admin/* *\/}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <AdminRouter />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
*/