//Maneja los datos globales de la aplicación, específicamente las
//categorías y productos. Se cargan UNA VEZ al inicio y están disponibles
//osea no se carga todo de nuevo

import React, { 
  createContext, // para crear el contexto en estado global
  useState, // para manejar los estados: categories, loading o error
  useContext, // para consumir el contexto en otros componentes
  ReactNode, // tipo para los componentes hijos
  useEffect // para ejecutar código y cargar datos
} from 'react';
import { Category, Product, CatalogoInicial } from '../types'; // tipos isea las interfaces
import { fetchInitialCatalog } from '../services/api'; // trae todo el catalogo


//DEFINICIÓN DE TIPOS
// tipo de datos a trabajar
interface DataContextType {
  categories: Category[]; // lista de todas las categorías activas
  allProducts: Product[]; // todos los productos activos
  seasonalProducts: Product[]; // productos de temporada
  loading: boolean; // mientras carga los contenidos
  error: string | null; // mensaje de error
}

// CREACIÓN DEL CONTEXTO
// se crea indefinido al inicio porque no hay provider activo
const DataContext = createContext<DataContextType | undefined>(undefined);

// PROVIDER DEL CONTEXTO
// envuelve componentes y provee las categorías y productos
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ESTADOS DEL COMPONENTE | se almacena el estado para las categorías y productos
  // son arrays vacíos que se llenan con los datos de la api

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // todos los productos
  const [seasonalProducts, setSeasonalProducts] = useState<Product[]>([]); // productos de temporada
  
  // mientras carga el catálogo es true la carga y es false cuando ya hay información o hay un error
  const [loading, setLoading] = useState(true);
  
  // estado de error es donde tira un mensaje | tira mensaje de error o null
  const [error, setError] = useState<string | null>(null);

  // CARGAR EL CATÁLOGO COMPLETO
  // useEffect es para ejecutar después del render del componente
  // se ejecuta del componente para ahorrar peticiones http
  // todos los componentes tienen los mismos datos de consistencia, lo hace más rápido
  useEffect(() => {
    //es una petición asincrona
    const loadCatalog = async () => {
      try {
        // al iniciar la petición se carga el loading
        setLoading(true);
        // Esta función llama a /api/Catalogo/inicial | trae categorias, productos y de temporada
        const catalog: CatalogoInicial = await fetchInitialCatalog();
        
        // guardar las categorías en el estado
        setCategories(catalog.categories);
        
        // guardar todos los productos en el estado
        setAllProducts(catalog.products);
        
        // guardar productos de temporada en el estado
        setSeasonalProducts(catalog.seasonal);
        
        // limpiar si hay errores
        setError(null);
        
      } catch (err) {
        // Manejo de errores
        // si fetchInitialCatalog() lanza error guarda el mensaje y lo pasa en consola
        setError('No se pudo cargar el catálogo. Por favor, inténtelo de nuevo más tarde.');
        console.error(err);
        
      } finally {
        // algo que se ejecuta siempre es que se cancele el cargado
        // ya que no es necesario si terminó la operación
        setLoading(false);
      }
    };

    // ejecutar la función de carga
    loadCatalog();
    
  }, []); // array vacío = ejecutar solo al iniciar

  // OPTIMIZACIÓN CON USEMEMO
  // este es para evitar re-renders innecesarios
  // se recrea si cambian las categorías o productos
  // los valores como son iguales devuelven lo mismo así que ya no se renderiza

  const value = React.useMemo(() => ({ 
    categories, 
    allProducts,
    seasonalProducts,
    loading, 
    error 
  }), [categories, allProducts, seasonalProducts, loading, error]);

  // RENDERIZAR EL PROVIDER
  // este da valor a los componentes hijos
  // cualquier componente que tenga categories, allProducts, seasonalProducts, loading, error
  // puede obtener acceso a estos datos 
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// HOOK PERSONALIZADO PARA CONSUMIR EL CONTEXTO
// simplificar el uso del contexto y agregar validación
export const useData = () => {
  // intenta obtener el contexto
  const context = useContext(DataContext);
  // devolver el contexto categories, allProducts, seasonalProducts, loading, error
  return context;
};