
//Maneja los datos globales de la aplicación, específicamente las
//categorías. Se cargan UNA VEZ al inicio y están disponibles en
//toda la app sin necesidad de cargarlas de nuevo.

import React, { 
  createContext, // Para crear el contexto (estado global)
  useState, // Para manejar los estados: categories, loading o error
  useContext, // Para consumir el contexto en otros componentes
  ReactNode, // Tipo para los componentes hijos
  useEffect // Para ejecutar código (cargar datos)
} from 'react';
import { Category } from '../types';          // Tipo de categoría
import { fetchCategories } from '../services/api'; // Función para obtener categorías


//DEFINICIÓN DE TIPOS

// tipo de datos a trabajar
interface DataContextType {
  categories: Category[];  // Lista de todas las categorías activas
  loading: boolean;        // mientras carga los contenidos
  error: string | null;    // Mensaje de error
}

// CREACIÓN DEL CONTEXTO
// se crea indefinido al inicio porque no hay provider activo

const DataContext = createContext<DataContextType | undefined>(undefined);

// PROVIDER DEL CONTEXTO
// envuelve componentes y provee las categorías


/** 
 * En App.tsx:
 * <DataProvider>
 *   <Header />       Puede usar useData() para mostrar categorías
 *   <HomePage />    Puede usar useData() para mostrar categorías
 *   <CategoryPage />  Puede usar useData() para mostrar nombre de categoría
 * </DataProvider>
 * 
 * //param children - Todos los componentes hijos que podrán usar useData()
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ESTADOS DEL COMPONENTE | se almacena el estado para las categorías
  // es un array vacío que se llena con los datos de la api

  const [categories, setCategories] = useState<Category[]>([]);
  
  // mientras carga las categorías es true la carga y es false cuando ya hay información o hay un error
  const [loading, setLoading] = useState(true);
  
  // estado de error es donde tira un mensaje | tira mensaje de error o null
  const [error, setError] = useState<string | null>(null);

  // cargar las categorías
  // useEffect es para ejecutar después del render del componente
  // se ejecuta una vez aquí en vez del componente para ahorrar peticiones http, todos los componentes tienen los mismos datos de consistencia
  // lo hace más rápido

  useEffect(() => {
    
    //es una petición asincrona
    const loadCategories = async () => {
      try {
        // al iniciar la petición se carga el loading
        setLoading(true);
        
        // se llama a la api para tener las categorías
        // mapear con formato Category
        // si falla entonces se devuelven datos preguardardos
        const fetchedCategories = await fetchCategories();
        
        // guardar las categorias en el estado
        setCategories(fetchedCategories);
        
        // limpiar si hay errores
        setError(null);
        
      } catch (err) {
        // Manejo de errores
        // si fetchCategories() lanza error guarda el mensaje y lo pasa en consola, devuelve un array vacío
        setError('No se pudieron cargar las categorías. Por favor, inténtelo de nuevo más tarde.');
        console.error(err);
        
      } finally {
        // algo que se ejecuta siempre es que se cancele el cargado, ya que no es necesario si terminó la operación
        setLoading(false);
      }
    };

    // Ejecutar la función de carga
    loadCategories();
    
  }, []); // Array vacío = ejecutar solo al iniciar

  // OPTIMIZACIÓN CON USEMEMO
  // este es para evitar re-renders innecesarios
  // se recrea si cambian las categorías, los valores como son iguales devuelven lo mismo así que ya no se renderiza

  const value = React.useMemo(() => ({ 
    categories, 
    loading, 
    error 
  }), [categories, loading, error]);

  // RENDERIZAR EL PROVIDER
  // este da valor a los componentes hijos
  // cualquier componente que tenga categories, loading, error puede obtener acceso a las categorías, o al loading o al error

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO
// simplificar el uso del contexto y agregar validación

export const useData = () => {
  // Intentar obtener el contexto
  const context = useContext(DataContext);
  
  // Si context es undefined, significa que no hay DataProvider
  if (context === undefined) {
    throw new Error(
      'useData must be used within a DataProvider. ' +
      'Asegúrate de que tu componente esté envuelto en <DataProvider>.'
    );
  }
  
  // Devolver el contexto (categories, loading, error)
  return context;
};


/*
// Ejemplo : HomePage mostrando grid de categorías
import { useData } from '../context/DataContext';
import CategoryCard from './CategoryCard';

const HomePage = () => {
  const { categories, loading, error } = useData();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Nuestras Categorías</h2>
      <div className="grid">
        {categories.map(category => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
};

*/
