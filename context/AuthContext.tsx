//Maneja la autenticación del administrador en toda la aplicación.
//Controla si el usuario está logueado o no, y provee funciones
//de login/logout que cualquier componente puede usar.


// Importaciones necesarias de React
import React, { 
  createContext,  // Para crear un contexto (estado global)
  useState,       // Para manejar el estado de autenticación
  useContext,     // Para consumir el contexto en otros componentes
  ReactNode,      // Tipo para los componentes hijos
  useMemo,        // Para optimizar el rendimiento
  useCallback     // Para optimizar funciones
} from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir a otras páginas


// SECCIÓN 1: DEFINICIÓN DE TIPOS


interface AuthContextType {
  isAuthenticated: boolean;                      // verificar si está logeado
  login: (user: string, pass: string) => boolean; // iniciar sesión
  logout: () => void;                            // cerrar sesión
}

// CREACIÓN DEL CONTEXTO

// el contexto es la variable global que puede usar todos los componentes
// entonces muchos componentes necesitan datos, esta forma es efectiva

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// SECCIÓN 3: CREDENCIALES 

// se desarrolla de manera sencilla ya que queremos algo práctico
// solo usuario + contraseña

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER; // Usuario del administrador
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; // Contraseña del administrador



// PROVIDER DEL CONTEXTO
/**
 * AuthProvider: Componente que envuelve la aplicación y provee el contexto
 * de autenticación a todos los componentes hijos
 * 
 * ¿Ejemplo?
 * En App.tsx o index.tsx:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  

// ESTADO DE AUTENTICACIÓN
// el estado controla si el usuario está autenticado
// verifica si autenticado es true entonces inicia sesión si no entonces devuelve false
// sessionStorage permite la persistencia de la sesión si se cambias de pestaña, se borra al cerrar navegador
// más seguro que el localStorage
  
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  return sessionStorage.getItem('isAuthenticated') === 'true';
});
  
  // Hook para navegar a otras rutas
  const navigate = useNavigate();


// FUNCIÓN DE LOGIN
/* Flujo del login:
   * 1. Usuario ingresa credenciales en LoginPage
   * 2. LoginPage llama a login(user, pass)
   * 3. Se verifica si las credenciales coinciden
   * 4. Si son correctas:
   *    - Actualiza el estado a true
   *    - Guarda en sessionStorage
   *    - Redirige a /admin
   *    - Devuelve true (éxito)
   * 5. Si son incorrectas:
   *    - No hace nada
   *    - Devuelve false (fallo)
 * 
 */
  const login = useCallback((user: string, pass: string): boolean => {
    // Comparar las credenciales ingresadas con las hardcodeadas
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
      // CREDENCIALES CORRECTAS
      setIsAuthenticated(true); // Actualizar estado
      sessionStorage.setItem('isAuthenticated', 'true'); // Guardar en navegador
      navigate('/admin'); // Redirigir al panel admin
      return true; // Indicar que si se realizó
    }
    // CREDENCIALES INCORRECTAS
    return false; // Indicar fallo y se muestra error
  }, [navigate]); // no rediirje 


  // FUNCIÓN DE LOGOUT
  
  /**
   * Flujo del logout:
   * 1. Admin hace click en "Cerrar sesión" en AdminLayout
   * 2. Se llama a logout()
   * 3. Actualiza el estado a false
   * 4. Elimina la sesión del sessionStorage
   * 5. Redirige a /login
   */
  const logout = useCallback(() => {
    setIsAuthenticated(false);// Actualizar estado
    sessionStorage.removeItem('isAuthenticated'); // Eliminar datos del navegador
    navigate('/login'); // Redirigir a login
  }, [navigate]); // no enruta


  // OPTIMIZACIÓN DEL VALOR DEL CONTEXTO

  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
  }), [isAuthenticated, login, logout]);


  // RENDERIZAR EL PROVIDER
  // todos los componentes hijo podrán utilizar useAuth();


  /**
   * Ejemplo de árbol de componentes:
   * <AuthProvider>              ← Provee el contexto
   *   <App>                     ← Puede usar useAuth()
   *     <Header>                ← Puede usar useAuth()
   *       <LoginButton />       ← Puede usar useAuth()
   *     </Header>
   *     <AdminPanel>            ← Puede usar useAuth()
   *       <ProductList />       ← Puede usar useAuth()
   *     </AdminPanel>
   *   </App>
   * </AuthProvider>
   */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO

export const useAuth = () => {
  // Intentar obtener el contexto
  const context = useContext(AuthContext);
  
  // Si context es undefined, significa que no hay AuthProvider
  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Asegúrate de que tu componente esté envuelto en <AuthProvider>.'
    );
  }
  
  // Devolver el contexto
  return context;
};


// EJEMPLO DE USO EN COMPONENTES


/*
// Ejemplo: Header.tsx (muestra botón de logout si está autenticado)
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header>
      <h1>Pastelería Canela</h1>
      {isAuthenticated && (
        <button onClick={logout}>Cerrar Sesión</button>
      )}
    </header>
  );
};

// Ejemplo: ProtectedRoute.tsx (bloquea rutas si no está autenticado)
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
*/