//Maneja los datos globales de la aplicación, específicamente las
//categorías y productos. Se cargan UNA VEZ al inicio y están disponibles en
//toda la app sin necesidad de cargarlas de nuevo.

import React, { 
  createContext, // Para crear el contexto (estado global)
  useState, // Para manejar los estados: categories, loading o error
  useContext, // Para consumir el contexto en otros componentes
  ReactNode, // Tipo para los componentes hijos
  useEffect // Para ejecutar código (cargar datos)
} from 'react';
import { Category, Product, CatalogoInicial } from '../types'; // Tipos
import { fetchInitialCatalog } from '../services/api'; // ⚡ Nueva función optimizada


//DEFINICIÓN DE TIPOS

// tipo de datos a trabajar
interface DataContextType {
  categories: Category[];        // Lista de todas las categorías activas
  allProducts: Product[];        // ⚡ NUEVO: Todos los productos activos
  seasonalProducts: Product[];   // ⚡ NUEVO: Productos de temporada
  loading: boolean;              // mientras carga los contenidos
  error: string | null;          // Mensaje de error
}

// CREACIÓN DEL CONTEXTO
// se crea indefinido al inicio porque no hay provider activo

const DataContext = createContext<DataContextType | undefined>(undefined);

// PROVIDER DEL CONTEXTO
// envuelve componentes y provee las categorías y productos


/** 
 * En App.tsx:
 * <DataProvider>
 *   <Header />         Puede usar useData() para mostrar categorías
 *   <HomePage />       Puede usar useData() para mostrar productos
 *   <CategoryPage />   Puede usar useData() para filtrar productos
 *   <ProductDetailPage />  Puede usar useData() para buscar productos
 * </DataProvider>
 * 
 * //param children - Todos los componentes hijos que podrán usar useData()
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ESTADOS DEL COMPONENTE | se almacena el estado para las categorías y productos
  // son arrays vacíos que se llenan con los datos de la api

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // ⚡ NUEVO
  const [seasonalProducts, setSeasonalProducts] = useState<Product[]>([]); // ⚡ NUEVO
  
  // mientras carga el catálogo es true la carga y es false cuando ya hay información o hay un error
  const [loading, setLoading] = useState(true);
  
  // estado de error es donde tira un mensaje | tira mensaje de error o null
  const [error, setError] = useState<string | null>(null);

  // ⚡ CARGAR EL CATÁLOGO COMPLETO
  // useEffect es para ejecutar después del render del componente
  // se ejecuta una vez aquí en vez del componente para ahorrar peticiones http
  // todos los componentes tienen los mismos datos de consistencia, lo hace más rápido
  // AHORA: Una sola petición HTTP trae categorías + productos + temporada

  useEffect(() => {
    
    //es una petición asincrona
    const loadCatalog = async () => {
      try {
        // al iniciar la petición se carga el loading
        setLoading(true);
        
        // ⚡ UNA SOLA PETICIÓN para todo el catálogo
        // Esta función llama a /api/Catalogo/inicial que devuelve:
        // - categories: todas las categorías activas
        // - products: todos los productos activos
        // - seasonal: productos de temporada
        const catalog: CatalogoInicial = await fetchInitialCatalog();
        
        // guardar las categorías en el estado
        setCategories(catalog.categories);
        
        // ⚡ NUEVO: guardar todos los productos en el estado
        // Ahora CategoryPage y ProductDetailPage pueden filtrar en memoria
        setAllProducts(catalog.products);
        
        // ⚡ NUEVO: guardar productos de temporada en el estado
        // HomePage los usa directamente sin hacer peticiones adicionales
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

    // Ejecutar la función de carga
    loadCatalog();
    
  }, []); // Array vacío = ejecutar solo al iniciar

  // OPTIMIZACIÓN CON USEMEMO
  // este es para evitar re-renders innecesarios
  // se recrea si cambian las categorías o productos
  // los valores como son iguales devuelven lo mismo así que ya no se renderiza

  const value = React.useMemo(() => ({ 
    categories, 
    allProducts,        // ⚡ NUEVO
    seasonalProducts,   // ⚡ NUEVO
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
  // Intentar obtener el contexto
  const context = useContext(DataContext);
  
  // Si context es undefined, significa que no hay DataProvider
  if (context === undefined) {
    throw new Error(
      'useData must be used within a DataProvider. ' +
      'Asegúrate de que tu componente esté envuelto en <DataProvider>.'
    );
  }
  
  // Devolver el contexto (categories, allProducts, seasonalProducts, loading, error)
  return context;
};


/*
// ⚡ Ejemplo NUEVO: CategoryPage filtrando en memoria (SIN peticiones HTTP)
import { useData } from '../context/DataContext';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();
  const { categories, allProducts, loading } = useData();

  // ⚡ Filtrar productos en memoria (instantáneo, 0ms)
  const category = categories.find(c => c.slug === slug);
  const products = allProducts.filter(p => p.category === slug);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>{category?.name}</h2>
      <div className="grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

*/