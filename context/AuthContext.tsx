//Maneja la autenticación del administrador en toda la aplicación.
//controla si el usuario está logueado o no, y provee funciones
// login/logout que cualquier componente puede usar.

// Importaciones necesarias de React
import React, { 
  createContext, // para crear un contexto (estado global)
  useState, // para manejar el estado de autenticación
  useContext, // para consumir el contexto en otros componentes
  ReactNode, // tipo para los componentes hijos
  useMemo, // para optimizar el rendimiento
  useCallback // para optimizar funciones
} from 'react';
import { useNavigate } from 'react-router-dom'; // para redirigir a otras páginas


// DEFINICIÓN DE TIPOS
interface AuthContextType {
  isAuthenticated: boolean; // verificar si está logeado
  login: (user: string, pass: string) => boolean; // iniciar sesión
  logout: () => void; // cerrar sesión
}

// CREACIÓN DEL CONTEXTO
// el contexto es la variable global que puede usar todos los componentes
// muchos componentes necesitan datos
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// CREDENCIALES 
// solo usuario + contraseña
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER; // Usuario del administrador
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; // Contraseña del administrador
// entorno virtual porque no quiero exponer esto



// PROVIDER DEL CONTEXTO
// AuthProvider es el componente que envuelve todo, da autenticación a sus hijos
// osea les pasa el contexto a todo el programa
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
// ESTADO DE AUTENTICACIÓN
// el estado controla si el usuario está autenticado
// verifica si autenticado es true entonces inicia sesión si no entonces devuelve false
// sessionStorage permite la persistencia de la sesión si se cambias de pestaña, se borra al cerrar navegador
  
const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
  return sessionStorage.getItem('isAuthenticated') === 'true';
});
  
  // Hook para navegar a otras rutas
  const navigate = useNavigate();


// FUNCIÓN DE LOGIN
  const login = useCallback((user: string, pass: string): boolean => {
    // comparar las credenciales ingresadas
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) {
      // CREDENCIALES CORRECTAS
      setIsAuthenticated(true); // actualizar estado
      sessionStorage.setItem('isAuthenticated', 'true'); // guardar en navegador
      navigate('/admin'); // redirigir al panel admin
      return true; // indicar que si se realizó
    }
    // CREDENCIALES INCORRECTAS
    return false; // indicar fallo y se muestra error
  }, [navigate]); // no rediirje 


  // FUNCIÓN DE LOGOUT
  const logout = useCallback(() => {
    setIsAuthenticated(false);// actualizar estado
    sessionStorage.removeItem('isAuthenticated'); // eliminar datos del navegador
    navigate('/login'); // redirigir a login
  }, [navigate]); // no enruta


  // OPTIMIZACIÓN DEL VALOR DEL CONTEXTO
  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
  }), [isAuthenticated, login, logout]);
// usa memoria para saber que datos tiene

  // RENDERIZAR EL PROVIDER
  // todos los componentes hijo podrán utilizar useAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// HOOK PARA CONSUMIR EL CONTEXTO
export const useAuth = () => {
  // intentar obtener el contexto
  const context = useContext(AuthContext);
  
  // Devolver el contexto
  return context;
};
