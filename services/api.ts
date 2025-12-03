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
    const MOCK_CATEGORIES: Category[] = [
    {
        slug: 'pasteles',                   
        name: 'Pasteles',                  
        description: 'Nuestra selección...',
        image: 'https://cdn.pixabay.com/photo/2019/11/22/23/22/food-4645917_1280.png', 
        icon: 'cake', 
    },
    ];
    const MOCK_PRODUCTS: Product[] = [
    {
        id: 'pastel-chocolate-fudge',       
        name: 'Pastel de Chocolate Fudge', 
        description: 'Intenso pastel...',
        image: 'https://cdn.pixabay.com/photo/2019/11/22/23/22/food-4645917_1280.png',
        category: 'pasteles',   
        prices: [     
        { size: '1 porción', price: 85.00 },
        { size: '8-10 personas', price: 450.00 },
        ],
        featured: true,                    
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
    export const updatePrice = (id: number, data: Omit<AdminProductPrice, 'productoPrecioId'>) => 
        apiRequest<void>(`/api/Precios/${id}`, 'PUT', data);

    // eliminar
    export const deletePrice = (id: number) => 
        apiRequest<void>(`/api/Precios/${id}`, 'DELETE');