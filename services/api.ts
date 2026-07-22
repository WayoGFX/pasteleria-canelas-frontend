    // este archivo se comunica con la API 

    // importamos los tipos que definen la estructura de datos
    import {
    Category,           
    Product,            
    ProductPrice,       
    AdminCategory,      
    AdminProductDetail, 
    AdminProductSummary,
    AdminProductPrice,
    CatalogoInicial,   
    } from '../types'; // viene de los tipos osea las interfaces


    // DATOS DE PRUEBA
    // se usan cuando la API no está disponible o falla XD
    const USE_MOCK_DATA_ON_FAIL = true;
   export const MOCK_CATEGORIES: Category[] = [
  {
    slug: 'pasteles',
    name: 'Pasteles',
    description: 'Deléitate con nuestra exquisita selección de pasteles, horneados a la perfección con los mejores ingredientes.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764813867/pastel-cerechoclo_fawi4x.jpg',
    icon: 'cake',
  },
  {
    slug: 'postres',
    name: 'Postres',
    description: 'Sumérgete en un mundo de sabor con nuestra selección de postres. Cada bocado es una experiencia única.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764813986/tartaleta-frutas_m4nrde.jpg',
    icon: 'icecream',
  },
  {
    slug: 'pan-dulce',
    name: 'Pan dulce',
    description: 'Disfruta el sabor tradicional de nuestro pan dulce, perfecto para acompañar tu café o para cualquier momento del día.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815712/orejitas_zkufjf.jpg',
    icon: 'bakery_dining',
  },
  {
    slug: 'personalizados',
    name: 'Personalizados',
    description: 'Crea el pastel de tus sueños. Elige cada detalle y nosotros lo haremos realidad para tu evento especial.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815142/pastel-mocca-cerezas_ctpp9w.jpg',
    icon: 'editcake',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'pastel-de-la-casa',
    name: 'Pastel de la Casa',
    description: 'Delicioso pastel frutal, nuestra especialidad y el perfecto para cualquier ocasión',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815054/pastel-galletas_pzwjuy.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 18.00 },
      { size: '12-15 personas', price: 25.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-diversin',
    name: 'Pastel Diversión',
    description: 'Tenemos diseños perfectos para celebrar con tus personajes favoritos, en tamaño, locura y diversión',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815479/pastel-dia-nino_suehdn.jpg',
    category: 'personalizados',
    prices: [
      { size: '10-12 personas', price: 22.00 },
      { size: '20 personas', price: 35.00 },
    ],
    featured: false,
  },
  {
    id: 'rosca-navidea',
    name: 'Rosca Navideña',
    description: 'Perfecta para esas celebraciones en familia, no olvides pedir la tuya personalizada',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815513/rosca-navide%C3%B1a_srlx3w.jpg',
    category: 'personalizados',
    prices: [
      { size: 'Familiar', price: 15.00 },
    ],
    featured: false,
  },
  {
    id: 'semita-alta',
    name: 'Semita Alta',
    description: 'Porque el sabor es increíble, te recomendamos nuestra semita alta con la miel más dulce para iniciar tus mañanas con fuerza',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815781/semita-alta_yasj4x.jpg',
    category: 'pan-dulce',
    prices: [
      { size: 'Porción', price: 1.50 },
      { size: 'Entera', price: 8.00 },
    ],
    featured: false,
  },
  {
    id: 'donas-clsicas',
    name: 'Donas Clásicas',
    description: 'Porque las donas no solo son en septiembre, aquí tienes para disfrutar cuando quieras como quieras, con los toppings de tu elección',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815653/donas_ajoj05.jpg',
    category: 'pan-dulce',
    prices: [
      { size: 'Unidad', price: 0.75 },
      { size: '6 Unidades', price: 4.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-de-vainilla-con-fresas-chocolatadas',
    name: 'Pastel de Vainilla con Fresas Chocolatadas',
    description: 'Un suave pastel de vainilla cubierto con un elegante capa de chocolate oscuro y coronado con nuestra cremosa Mousse de chocolate y frescas fresas. Un sabor que siempre enamora.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814904/pastel-vainilla-chocolate-fresas_dtbgjx.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 20.00 },
      { size: '15 personas', price: 28.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-frutal-de-melocotn-y-fresas',
    name: 'Pastel Frutal de Melocotón y Fresas',
    description: 'Una opción refrescante. Relleno ligero con la dulzura natural del melocotón y la acidez de las fresas frescas',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814507/pastel-melocoton-fresas_lvyjak.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 18.00 },
      { size: '12-15 personas', price: 25.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-de-vainilla-y-frutas-con-caramelo',
    name: 'Pastel de Vainilla y Frutas con Caramelo',
    description: 'Suave pastel de vainilla con capas de crema pastelera y frutas frescas, sellado con un delicioso y brillante baño de caramelo',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814625/pastel-frutal_rtlerx.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 19.00 },
      { size: '12-15 personas', price: 26.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-mocca-y-cerezas',
    name: 'Pastel Mocca y Cerezas',
    description: 'Un suave pastel de Mocca bañado en una seductora capa de chocolate oscuro y coronado con cerezas jugosas. La armonía perfecta entre lo dulce y lo intenso.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815142/pastel-mocca-cerezas_ctpp9w.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 21.00 },
      { size: '12-15 personas', price: 29.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-de-quinces',
    name: 'Pastel de Quinces',
    description: 'Delicioso pastel de 4 niveles, perfecto para impresionar a tus invitados con un sabor exquisito y una vista perfecta que te hará celebrar en grande tus quince primaveras',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815174/pastel-15_prn7lb.jpg',
    category: 'personalizados',
    prices: [
      { size: '4 Niveles (~50 personas)', price: 95.00 },
    ],
    featured: false,
  },
  {
    id: 'maria-luisa',
    name: 'Maria Luisa',
    description: 'La perfecta e inigualable maria luisa, pero preparada con nuestro sazón y rellena de crema, perfecta para tus tardes',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815552/maria-luisa-rellena_ceyzzk.jpg',
    category: 'pan-dulce',
    prices: [
      { size: 'Porción', price: 1.25 },
      { size: 'Entera', price: 6.50 },
    ],
    featured: false,
  },
  {
    id: 'quesadillas',
    name: 'Quesadillas',
    description: 'Las mejores quesadillas de Apopa! sin duda debes probar nuestro platillo estrella',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815608/quesadillas_xytlxd.jpg',
    category: 'pan-dulce',
    prices: [
      { size: 'Pequeña', price: 2.50 },
      { size: 'Grande', price: 5.00 },
    ],
    featured: false,
  },
  {
    id: 'orejitas',
    name: 'Orejitas',
    description: 'Para aquellos que les encantan los clásicos, tenemos lo que queda perfecto con tu cafecito de las tardes',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815712/orejitas_zkufjf.jpg',
    category: 'pan-dulce',
    prices: [
      { size: 'Paquete 6 uds', price: 2.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-frutal-de-mocca',
    name: 'Pastel Frutal de Mocca',
    description: 'La intensidad aromática del café se abraza con la dulzura jugosa de las frutas frescas. Una sinfonía cremosa, ideal para cualquier celebración.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814699/pastel-mocca_yux6d9.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 20.00 },
      { size: '12-15 personas', price: 27.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-explosin-rosa',
    name: 'Pastel Explosión Rosa',
    description: 'Un pastel de ensueño cubierto con un tono vibrante, delicados rosetones cremosos y una exuberante corona de fresas frescas. El centro de atención de cualquier fiesta.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814774/pastel-explosion-rosa_lqq6cb.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 22.00 },
      { size: '12-15 personas', price: 30.00 },
    ],
    featured: false,
  },
  {
    id: 'pastel-aesthetic',
    name: 'Pastel Aesthetic',
    description: 'Para esa era aesthetic con un sabor inigualable, perfecto para celebrar o pasar una tarde de picnic con tus seres queridos',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815332/pastel-aesthetic_llqq7o.jpg',
    category: 'personalizados',
    prices: [
      { size: 'Mini (Picnic)', price: 12.00 },
      { size: '8-10 personas', price: 22.00 },
    ],
    featured: true,
  },
  {
    id: 'pastel-snoopy-yard',
    name: 'Pastel Snoopy Yard',
    description: 'Un lindo pastel de nuestro amigo Snoopy, perfecto para los fans que quieran tener un bonito y delicioso recuerdo',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764815253/pastel-snoopy_io5ejd.jpg',
    category: 'personalizados',
    prices: [
      { size: '8-10 personas', price: 24.00 },
    ],
    featured: false,
  },
  {
    id: 'porcin-de-budn-de-leche-y-pasas',
    name: 'Porción de Budín de Leche y Pasas',
    description: 'La calidez y el sabor de hogar. Un budín suave y cremoso con un toque de caramelo, leche y pasas. ¡Ideal para esta temporada!',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814386/budin-leche-pasas_bfcmc3.jpg',
    category: 'postres',
    prices: [
      { size: 'Porción', price: 2.25 },
    ],
    featured: false,
  },
  {
    id: 'pastel-de-galleta',
    name: 'Pastel de Galleta',
    description: 'Una base crujiente y un relleno suave y cremoso que evoca el sabor de tus galletas favoritas. Una textura inesperada y deliciosa.',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764813867/pastel-cerechoclo_fawi4x.jpg',
    category: 'pasteles',
    prices: [
      { size: '8-10 personas', price: 18.00 },
    ],
    featured: false,
  },
  {
    id: 'porcin-de-tres-leches-especialidad',
    name: 'Porción de Tres Leches (Especialidad)',
    description: 'Nuestra joya de la corona. Un bizcocho esponjoso, empapado en nuestra mezcla secreta de tres leches y coronado con la canela que nos representa, simplemente perfecto',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814048/tresleches_uirfdf.jpg',
    category: 'postres',
    prices: [
      { size: 'Porción', price: 3.50 },
    ],
    featured: false,
  },
  {
    id: 'tartaleta-de-frutas-frescas',
    name: 'Tartaleta de Frutas Frescas',
    description: 'El equilibrio perfecto entre la base crujiente, la suave crema pastelera y el brillo de la fruta fresca de la temporada. Perfecto para todas ocasiones',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764813986/tartaleta-frutas_m4nrde.jpg',
    category: 'postres',
    prices: [
      { size: 'Individual', price: 3.00 },
      { size: 'Familiar', price: 16.00 },
    ],
    featured: true,
  },
  {
    id: 'porcin-de-chocoflan',
    name: 'Porción de ChocoFlan',
    description: 'Un intenso flan de vainilla que descansa sobre un húmedo y chocolatoso pastel, unidos por una dulce capa de caramelo, te vas a querer repetir',
    image: 'https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814201/chocoflan-porcion_wzghqo.jpg',
    category: 'postres',
    prices: [
      { size: 'Porción', price: 3.00 },
    ],
    featured: false,
  },
];


    // CONFIGURACIÓN DE LA API
    // url de la api para poder conectarse .env
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

    // FUNCIONES DE MAPEO
    // estas funciones transforman los datos de la API 

    const getImageUrl = (imageName: string) => {
        // si no hay nombre de imagen devolver un placeholder
        if (!imageName) {
            return 'https://cdn.pixabay.com/photo/2019/11/22/23/22/food-4645917_1280.png';
        }
        // si ya es una URL completa devolverla tal cual
        if (imageName.startsWith('http')) {
            return imageName;
        }
        // si es un nombre de archivo
        // quita cualquier / al inicio y agrega la extensión .webp o jpg lo que quiera
        return `./images/${imageName.replace(/^\//, '')}.webp`;
    };

    // mapeo dep roductos
    const mapApiProductPrice = (apiPrice: any, index: number): ProductPrice => ({
        size: apiPrice.descripcionPrecio || `Opción ${index + 1}`, // si no hay descripción pone texto por defecto
        price: apiPrice.precio,
    });

    // mapeo de categorias
    const mapApiCategory = (apiCategory: any): Category => {
        // si no viene categoría devolver una por defecto
        if (!apiCategory) {
            return { 
            slug: '', 
            name: 'Sin categoría', 
            description: '', 
            image: '', 
            icon: 'help' 
            };
        }
        return {
            slug: apiCategory.slug,
            name: apiCategory.nombre,
            description: apiCategory.descripcion,
            image: getImageUrl(apiCategory.imagenUrl),
            icon: apiCategory.icono,
        };
    };

    // productos dto pero para admin
    const mapApiAdminProductSummary = (apiProduct: any): AdminProductSummary => ({
        productoId: apiProduct.productoId,
        nombre: apiProduct.nombre,
        slug: apiProduct.slug,
        descripcion: apiProduct.descripcion,
        imagenUrl: getImageUrl(apiProduct.imagenUrl),
        activo: apiProduct.activo,
        esDeTemporada: apiProduct.esDeTemporada,
        categoriaId: apiProduct.categoria.categoriaId,
        productoPrecios: apiProduct.productoPrecios || [], // lista de precios
    });

    // LLAMADAS A LA API
    const apiRequest = async <T>(
        endpoint: string, 
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
        body?: any
    ): Promise<T> => {
        // configuración de la petición HTTP
        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        // si hay datos para enviar POST/PUT los agrega al body
        if (body) {
            config.body = JSON.stringify(body); // c0nvertir objeto JS a string JSON
        }

        // hacer la petición HTTP
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // si la respuesta NO es exitosa
        if (!response.ok) {
            let errorMessage = `fallo al llamar la api : ${response.statusText}`;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorBody.title || JSON.stringify(errorBody);
            } catch (e) {
            }
            throw new Error(errorMessage);
        }
        
        // si la respuesta es 204 No Content o está vacía envia null
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }
        
        // devolver el JSON
        return response.json();
    };



//  CATÁLOGO 
export const fetchInitialCatalog = async (): Promise<CatalogoInicial> => {
    try {
        // una sola petición HTTP
        const apiData = await apiRequest<any>('/api/Catalogo/inicial');
        
        // mapear categorías
        const categories = apiData.categorias
            .filter((cat: any) => cat.activo)
            .map(mapApiCategory);
        
        // mapear productos con slug
        const products = apiData.productos.map((p: any) => ({
            id: p.slug,
            name: p.nombre,
            description: p.descripcion,
            image: getImageUrl(p.imagenUrl),
            category: p.categoriaSlug, //solo el slug
            prices: (p.productoPrecios || []).map(mapApiProductPrice),
            seasonal: p.esDeTemporada,
            featured: p.esDestacado || false,
        }));
        
        // productos de temporada
        const seasonal = apiData.temporada.map((p: any) => ({
            id: p.slug,
            name: p.nombre,
            description: p.descripcion,
            image: getImageUrl(p.imagenUrl),
            category: p.categoriaSlug,
            prices: (p.productoPrecios || []).map(mapApiProductPrice),
            seasonal: true,
            featured: p.esDestacado || false,
        }));
        
        return {
            categories,
            products,
            seasonal,
        };
    } catch (error) {
        console.warn("Fallo al conectar el catálogo inicial, se conectan los datos de prueba.", error);
        // Si falla usar datos de prueba
        if (USE_MOCK_DATA_ON_FAIL) {
            return {
                categories: MOCK_CATEGORIES,
                products: MOCK_PRODUCTS,
                seasonal: MOCK_PRODUCTS.filter(p => p.seasonal),
            };
        }
        throw error;
    }
};
    // API DE ADMINISTRACIÓN 
    export const fetchAdminCategories = () => 
        apiRequest<AdminCategory[]>('/api/Categorias');


    // se obtienen categorías por id 
    export const fetchAdminCategoryById = (id: number) => 
        apiRequest<AdminCategory>(`/api/Categorias/${id}`);

    // crear nueva categoria
    export const createCategory = (data: Omit<AdminCategory, 'categoriaId' | 'slug' | 'activo'>) => 
        apiRequest<AdminCategory>('/api/Categorias', 'POST', data);
    
    // actualizar
    export const updateCategory = (id: number, data: AdminCategory) => 
        apiRequest<void>(`/api/Categorias/${id}`, 'PUT', data);

    // eliminar
    export const deleteCategory = (id: number) => 
        apiRequest<void>(`/api/Categorias/${id}`, 'DELETE');


    // PRODUCTOS
    export const fetchAdminProducts = async (): Promise<AdminProductSummary[]> => {
        const apiProducts = await apiRequest<any[]>('/api/Productos');
        // mapear cada producto al formato AdminProductSummary
        return apiProducts.map(mapApiAdminProductSummary);
    };

    // traer producto por id
    export const fetchAdminProductById = (id: number) => 
        apiRequest<AdminProductDetail>(`/api/Productos/${id}`);
    
    // crear producto
    export const createProduct = (data: any) => 
        apiRequest<AdminProductDetail>('/api/Productos', 'POST', data);

    // actualizar
    export const updateProduct = (id: number, data: any) => 
        apiRequest<void>(`/api/Productos/${id}`, 'PUT', data);

    // eliminar
    export const deleteProduct = (id: number) => 
        apiRequest<void>(`/api/Productos/${id}`, 'DELETE');


    // PRECIOS
    // crear
    export const createPrice = (data: { 
        productoId: number; 
        descripcionPrecio: string; 
        precio: number 
    }) => apiRequest<AdminProductPrice>('/api/Precios', 'POST', data);

    // actualizar
    export const updatePrice = (id: number, data: Partial<AdminProductPrice>) => 
        apiRequest<void>(`/api/Precios/${id}`, 'PUT', data);

    // eliminar
    export const deletePrice = (id: number) => 
        apiRequest<void>(`/api/Precios/${id}`, 'DELETE');