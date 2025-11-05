// TIPOS PARA EL CATÁLOGO PÚBLICO (lo que ven los clientes)

export type CategorySlug = string;

// interface de Precio Producto
export interface ProductPrice {
  size: string; // Descripción del tamaño
  price: number; // Definir precio
}

// interface de Productos
export interface Product {
  id: string; // para el usuario se usa slug
  name: string;
  description: string;
  image: string;
  category: CategorySlug; // Slug de la categoría a la que pertenece
  prices: ProductPrice[]; // Array de precios (puede tener 1 o más o ninguno)
  featured?: boolean; // para destacar productos
  seasonal?: boolean; //es producto de temporada
}

// categoria 
export interface Category {
    slug: CategorySlug;  // para definir su url | ya definimos su tipo
    name: string;
    description: string;
    image: string; // url de la imagen
    icon: string; 
}

// ✨ NUEVO: Tipo para el catálogo inicial optimizado
// Este tipo representa la respuesta del endpoint /api/Catalogo/inicial
// Contiene todo lo necesario para cargar el catálogo en una sola petición
export interface CatalogoInicial {
  categories: Category[];   // Todas las categorías activas
  products: Product[];       // Todos los productos activos
  seasonal: Product[];       // Productos de temporada (subconjunto de products)
}

// TIPOS PARA EL CARRITO DE COMPRAS
 
//Representa un item en el carrito de compras
// el id no es el id del producto si no que es una combinación de productoid + precio y tamaño seleccionado
// algo como: pastel-chocolate-1-porcion
// esto es porque el mismo producto se puede seleccionar con diferente tamaño

// interface de carrito
export interface CartItem {
  id: string; // combinación de id + tamaño + precio
  name: string; // Nombre del producto
  image: string;
  quantity: number; // cantidad del item
  selectedPrice: ProductPrice; // precio seleccionado
}


// TIPOS PARA PASTELES PERSONALIZADOS
// Estos tipos se usan en la página de Personalizar Pasteles

// Este es para la opción de cada seccción
export interface CustomCakeOption {
    id: string;      // ID único de la opción como  'chocolate', 'vainilla', 'fresa'
    name: string;    // Nombre visible: "Chocolate", "Vainilla", "Fresa"
    image: string;   // Imagen representativa de la opción
}



// este representa la sección 
export interface CustomCakeSection {
    // El ID puede ser solo uno de estos valores específicos ya definidos
    // Esto asegura que no haya secciones inventadas o algo raro
    id: 'size' | 'flavor' | 'filling' | 'frosting' | 'decoration' | 'shape' | 'syrup';
    name: string;                   // Nombre de la sección
    options: CustomCakeOption[];    // Array con todas las opciones disponibles
}


// este es para seleccionar una llave y el texto, esto para lo que selecciona el usuario
// 'frosting': 'buttercream',
// 'decoration': 'flores',

export type CustomCakeSelection = {
    [key: string]: string | null;
};


// SECCIÓN 4: TIPOS PARA TESTIMONIOS

// este es para los testimonios que se tienen
export interface Testimonial {
    quote: string;
    author: string;
    rating: number;
}



// SECCIÓN 5: TIPOS PARA EL PANEL DE ADMINISTRACIÓN
// Estos tipos son solo para el panel de administración

// categoria admin
export interface AdminCategory {
    categoriaId: number;
    nombre: string; 
    slug: string;
    descripcion: string;
    icono: string;
    imagenUrl: string;
    activo: boolean;
}

// producto precio . este tiene el id
export interface AdminProductPrice {
    productoPrecioId: number;// ID 
    descripcionPrecio: string;
    precio: number;
}

/**
 * Representa un producto resumido para las listas del admin
 * Se usa en ProductListPage (la tabla de productos)
 * 
 * ¿Por qué "Summary" (resumido)?
 * - Tiene los campos necesarios para mostrar en una lista/tabla
 * - No tiene todos los detalles (eso es AdminProductDetail)
 * - Más ligero para cargar listas largas
 * 
 * Campos clave:
 * - productoId: ID numérico (para editar/eliminar)
 * - slug: Para URLs públicas
 * - activo: Para mostrar/ocultar del catálogo
 * - esDeTemporada: Marca si es producto de temporada
 * - categoriaId: Para filtrar por categoría
 * - productoPrecios: Lista de precios (para mostrar cuántos tiene)
 */

// este sumary es un dto resumido para mostrar en la lista, más ligero y tiene solo lo necesario para el admin
export interface AdminProductSummary {
    productoId: number;
    nombre: string;
    slug: string;
    descripcion: string;
    imagenUrl: string;
    activo: boolean;
    esDeTemporada: boolean;
    categoriaId: number;
    productoPrecios: AdminProductPrice[];
}

// detalles de producto
export interface AdminProductDetail {
    productoId: number;
    nombre: string;
    descripcion: string;
    imagenUrl: string;
    activo: boolean;
    slug: string;
    categoria: AdminCategory;
    esDeTemporada: boolean;
    productoPrecios: AdminProductPrice[];
}
