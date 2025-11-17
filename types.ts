// TIPOS PARA EL CATÁLOGO PÚBLICO
export type CategorySlug = string;

// interface de precio producto
export interface ProductPrice {
  size: string; // descripción del tamaño
  price: number; // definir precio
}

// interface de Productos
export interface Product {
  id: string; // para el usuario se usa slug
  name: string;
  description: string;
  image: string;
  category: CategorySlug; // slug de la categoría a la que pertenece
  prices: ProductPrice[]; // array de precios puede tener 1 o más o ninguno
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

// tipo para el catálogo inicial optimizado
// /api/Catalogo/inicial
// contiene todo lo necesario para cargar el catálogo en una sola petición | asi bien eficiente
export interface CatalogoInicial {
  categories: Category[]; // todas las categorías activas
  products: Product[]; // todos los productos activos
  seasonal: Product[]; // productos de temporada
}

// TIPOS PARA EL CARRITO DE COMPRAS
//representa un item en el carrito de compras
// el id no es el id del producto si no que es una combinación de productoid + precio y tamaño seleccionado
// algo como pastel-chocolate-1-porcion
// esto es porque el mismo producto se puede seleccionar con diferente tamaño

// interface de carrito
export interface CartItem {
  id: string; // combinación de id + tamaño + precio
  name: string; // nombre del producto
  image: string;
  quantity: number; // cantidad del item
  selectedPrice: ProductPrice; // precio seleccionado
}


// TIPOS PARA PASTELES PERSONALIZADOS
// estos tipos se usan en la página de Personalizar Pasteles

// este es para la opción de cada seccción
export interface CustomCakeOption {
    id: string; // ID único de la opción como  chocolate, vainilla, fresa
    name: string; // nombre Chocolate, Vainilla,Fresa
    image: string; // imagende la opción
}



// este representa la sección 
export interface CustomCakeSection {
    // ID puede ser solo uno de valores específicos ya definidos
    // esto asegura que no haya secciones inventadas o algo raro
    id: 'size' | 'flavor' | 'filling' | 'frosting' | 'decoration' | 'shape' | 'syrup';
    name: string; // nombre de la sección
    options: CustomCakeOption[]; // array con todas las opciones disponibles
}

// selecciona una llave y el texto
// decoration: flores,

export type CustomCakeSelection = {
    [key: string]: string | null;
};

// TIPOS PARA TESTIMONIOS
export interface Testimonial {
    quote: string;
    author: string;
    rating: number;
}



// TIPOS PARA EL PANEL DE ADMINISTRACIÓN

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

// producto precio
export interface AdminProductPrice {
    productoPrecioId: number;// ID 
    descripcionPrecio: string;
    precio: number;
}

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
