    // Este archivo se comunica con la API 

    // Importamos los tipos que definen la estructura de nuestros datos
    import {
    Category,           
    Product,            
    ProductPrice,       
    AdminCategory,      
    AdminProductDetail, 
    AdminProductSummary,
    AdminProductPrice,   
    } from '../types';


    // SECCIÓN 1: DATOS DE PRUEBA (MOCK DATA)
    // Estos datos se usan cuando la API no está disponible o falla.

    // por si no conecta los datos ya se enlazan los datos de prueba
    const USE_MOCK_DATA_ON_FAIL = true;

    // Categorías de ejemplo que simulan lo que devolvería la API
    const MOCK_CATEGORIES: Category[] = [
    {
        slug: 'pasteles',                   
        name: 'Pasteles',                  
        description: 'Nuestra selección...',
        image: 'https://picsum.photos/...', 
        icon: 'cake', 
    },
    ];

    // Productos de ejemplo
    const MOCK_PRODUCTS: Product[] = [
    {
        id: 'pastel-chocolate-fudge',       
        name: 'Pastel de Chocolate Fudge', 
        description: 'Intenso pastel...',
        image: 'https://picsum.photos/...',
        category: 'pasteles',   
        prices: [     
        { size: '1 porción', price: 85.00 },
        { size: '8-10 personas', price: 450.00 },
        ],
        featured: true,                    
    },
    ];


    // SECCIÓN 2: CONFIGURACIÓN DE LA API

    // url de la api para poder conectarse .env
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


    // SECCIÓN 3: FUNCIONES DE MAPEO

    // Estas funciones transforman los datos de la API 


    /**
     * Convierte una URL de imagen a un formato completo
     * @param imageName - Nombre o URL de la imagen
     * @returns URL completa de la imagen
     * 
     * Ejemplos:
     * - Si viene "producto1" → devuelve "./images/producto1.webp"
     * - Si viene "http://..." → devuelve la misma URL
     * - Si viene vacío → devuelve un placeholder
     */
    const getImageUrl = (imageName: string) => {
        // Si no hay nombre de imagen, devolver un placeholder
        if (!imageName) {
            return 'https://picsum.photos/seed/placeholder/500/500';
        }
        // Si ya es una URL completa (empieza con http), devolverla tal cual
        if (imageName.startsWith('http')) {
            return imageName;
        }
        // Si es un nombre de archivo, construir la ruta completa
        // Quita cualquier "/" al inicio y agrega la extensión .webp
        return `./images/${imageName.replace(/^\//, '')}.webp`;
    };

    /**
     * Convierte un precio de la API al formato del frontend
     * @param apiPrice - Objeto precio de la API: { descripcionPrecio, precio }
     * @param index - Índice del precio (para generar nombre si falta)
     * @returns Objeto ProductPrice: { size, price }
     * 
     * Transforma de:
     * { descripcionPrecio: "1 porción", precio: 85.00 }
     * a:
     * { size: "1 porción", price: 85.00 }
     */
    const mapApiProductPrice = (apiPrice: any, index: number): ProductPrice => ({
        size: apiPrice.descripcionPrecio || `Opción ${index + 1}`, // Si no hay descripción, usar "Opción 1", "Opción 2", etc.
        price: apiPrice.precio,
    });

    /**
     * Convierte una categoría de la API al formato del frontend
     * @param apiCategory - Categoría desde la API con campos en español
     * @returns Objeto Category para usar en el frontend
     * 
     * Mapeo de campos:
     * - nombre → name
     * - descripcion → description
     * - imagenUrl → image (procesada por getImageUrl)
     * - icono → icon
     * - slug → slug (se mantiene igual)
     */
    const mapApiCategory = (apiCategory: any): Category => {
        // Si no viene categoría, devolver una por defecto
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

    /**
     * Convierte un producto resumido de la API al formato del frontend
     * Usado en listas de productos (catálogo público)
     * @param apiProduct - Producto desde la API
     * @param categorySlug - Slug de la categoría (viene por separado)
     * @returns Objeto Product para el catálogo
     */
    const mapApiProductSummary = (apiProduct: any, categorySlug: string): Product => ({
        id: apiProduct.slug,                    // para el usuario usamos slug
        name: apiProduct.nombre,
        description: apiProduct.descripcion,
        image: getImageUrl(apiProduct.imagenUrl),
        category: categorySlug,                 // Categoría a la que pertenece
        prices: (apiProduct.productoPrecios || []).map(mapApiProductPrice), // Mapea todos los precios
        seasonal: categorySlug === 'temporada', // Si la categoría es "temporada", marcarlo
        featured: apiProduct.esDestacado,       // ¿Es destacado?
    });

    /**
     * Convierte un producto de la API al formato AdminProductSummary
     * Usado en la lista de productos del panel admin
     * @param apiProduct - Producto completo desde la API
     * @returns AdminProductSummary con todos los campos necesarios
     */
    const mapApiAdminProductSummary = (apiProduct: any): AdminProductSummary => ({
        productoId: apiProduct.productoId,      // ID numérico (para admin)
        nombre: apiProduct.nombre,
        slug: apiProduct.slug,
        descripcion: apiProduct.descripcion,
        imagenUrl: getImageUrl(apiProduct.imagenUrl),
        activo: apiProduct.activo,              // ¿Está activo o inactivo?
        esDeTemporada: apiProduct.esDeTemporada,
        categoriaId: apiProduct.categoria.categoriaId, // ID de la categoría
        productoPrecios: apiProduct.productoPrecios || [], // Lista de precios
    });

    /**
     * Convierte el detalle completo de un producto de la API
     * Usado en la página de detalle de producto (catálogo público)
     * @param apiProduct - Producto completo con categoría incluida
     * @returns Product con todos los detalles
     */
    const mapApiProductDetail = (apiProduct: any): Product => ({
        id: apiProduct.slug,
        name: apiProduct.nombre,
        description: apiProduct.descripcion,
        image: getImageUrl(apiProduct.imagenUrl),
        category: apiProduct.categoria?.slug || '', // Slug de la categoría
        prices: (apiProduct.productoPrecios || []).map(mapApiProductPrice),
        seasonal: apiProduct.esDeTemporada,
        featured: apiProduct.esDestacado,
    });


    // SECCIÓN 4: FUNCIÓN GENÉRICA PARA LLAMADAS A LA API

    /**
     * Función genérica para hacer peticiones HTTP a la API
     * @param endpoint - Ruta del endpoint (ej: '/api/Productos')
     * @param method - Método HTTP: GET, POST, PUT, DELETE
     * @param body - Datos a enviar (para POST/PUT)
     * @returns Promesa con la respuesta parseada como JSON
     * 
     * Esta función:
     * 1. Construye la petición HTTP con headers JSON
     * 2. Envía los datos si es POST/PUT
     * 3. Maneja errores de la API
     * 4. Devuelve los datos parseados
     */
    const apiRequest = async <T>(
        endpoint: string, 
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
        body?: any
    ): Promise<T> => {
        // Configuración de la petición HTTP
        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',  // Enviamos JSON
                'Accept': 'application/json',        // Esperamos JSON
            },
        };

        // Si hay datos para enviar (POST/PUT), agregarlos al body
        if (body) {
            config.body = JSON.stringify(body); // Convertir objeto JS a string JSON
        }

        // Hacer la petición HTTP
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Si la respuesta NO es exitosa (código 400-599)
        if (!response.ok) {
            let errorMessage = `Fallo al llamar la api : ${response.statusText}`;
            try {
                // Intentar leer el mensaje de error del backend
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorBody.title || JSON.stringify(errorBody);
            } catch (e) {
            }
            throw new Error(errorMessage);
        }
        
        // Si la respuesta es 204 (No Content) o está vacía, devolver null
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }
        
        // Parsear y devolver el JSON
        return response.json();
    };


    // SECCIÓN 5: API PÚBLICA - CATÁLOGO (para clientes)
    // Estas funciones son las que usa el catálogo para el cliente

    /**
     * Obtiene todas las categorías activas
     * Endpoint: GET /api/Categorias
     * Usado en: DataContext (se carga al inicio de la app)
     */
    export const fetchCategories = async (): Promise<Category[]> => {
        try {
            // Llamar a la API
            const apiCategories = await apiRequest<any[]>('/api/Categorias');
            // Filtrar solo las categorías activas y mapearlas al formato frontend
            return apiCategories.filter(cat => cat.activo).map(mapApiCategory);
        } catch (error) {
            console.warn("Fallo al conectar los productos, se conectan los datos de prueba.", error);
            // Si falla, usar datos de prueba
            if (USE_MOCK_DATA_ON_FAIL) {
                return MOCK_CATEGORIES;
            }
            throw error; // Si no hay fallback, propagar el error
        }
    };

    /**
     * Obtiene productos de temporada
     * Endpoint: GET /api/Catalogo/temporada
     * Usado en: HomePage (sección "Lo más popular")
     */
    export const fetchSeasonalProducts = async (): Promise<Product[]> => {
        try {
            const apiProducts = await apiRequest<any[]>('/api/Catalogo/temporada');
            // Mapear todos los productos
            // Se les asigna la categoría 'temporada' automáticamente
            return apiProducts.map(p => mapApiProductSummary(p, 'temporada'));
        } catch (error) {
            console.warn("Fallo al conectar los productos, se conectan los datos de prueba.", error);
            if (USE_MOCK_DATA_ON_FAIL) {
                // Devolver solo los productos marcados como 'seasonal'
                return MOCK_PRODUCTS.filter(p => p.seasonal);
            }
            throw error;
        }
    };

    /**
     * Obtiene productos de una categoría específica
     * Endpoint: GET /api/Catalogo/categoria/{slug}
     * Usado en: CategoryPage (cuando visitas /category/pasteles)
     * @param slug - Identificador de la categoría (ej: 'pasteles', 'galletas')
     */
    export const fetchProductsByCategory = async (slug: string): Promise<Product[]> => {
        try {
            const apiProducts = await apiRequest<any[]>(`/api/Catalogo/categoria/${slug}`);
            // Mapear productos y asignarles el slug de la categoría
            return apiProducts.map(p => mapApiProductSummary(p, slug));
        } catch (error) {
            console.warn(`Error al llamar productos de categoría ${slug}, se llaman productos de prueba.`, error);
            if (USE_MOCK_DATA_ON_FAIL) {
                // Filtrar productos de ejemplo que pertenezcan a esta categoría
                return MOCK_PRODUCTS.filter(p => p.category === slug);
            }
            throw error;
        }
    };

    /**
     * Obtiene el detalle completo de un producto
     * Endpoint: GET /api/Catalogo/producto/{slug}
     * Usado en: ProductDetailPage (cuando visitas /product/pastel-chocolate)
     * @param slug - Identificador del producto
     * @returns Objeto con el producto Y su categoría completa
     */
    export const fetchProductBySlug = async (slug: string): Promise<{ product: Product; category: Category }> => {
        try {
            const apiProduct = await apiRequest<any>(`/api/Catalogo/producto/${slug}`);

            // Validar que vino algo
            if (!apiProduct) {
                throw new Error(`Error al llamar Producto '${slug}' fallo.`);
            }

            // Mapear el producto completo
            const product = mapApiProductDetail(apiProduct);
            // Mapear la categoría del producto
            const category = mapApiCategory(apiProduct.categoria);
            
            return { product, category };
        } catch (error) {
            console.warn(`API call for product ${slug} failed, falling back to mock data.`, error);
            if (USE_MOCK_DATA_ON_FAIL) {
                // Buscar el producto en los datos de prueba
                const product = MOCK_PRODUCTS.find(p => p.id === slug);
                if (!product) {
                    throw new Error(`Mock product with slug '${slug}' not found.`);
                }
                // Buscar su categoría
                const category = MOCK_CATEGORIES.find(c => c.slug === product.category);
                
                return { 
                    product, 
                    category: category || { slug: '', name: 'Sin categoría', description: '', image: '', icon: 'help' } 
                };
            }
            throw error;
        }
    };


    // SECCIÓN 6: API DE ADMINISTRACIÓN - CATEGORÍAS
    // Funciones CRUD para gestionar categorías desde el panel admin

    /**
     * Obtiene TODAS las categorías (activas e inactivas)
     * Endpoint: GET /api/Categorias
     * Usado en: CategoryListPage
     */
    export const fetchAdminCategories = () => 
        apiRequest<AdminCategory[]>('/api/Categorias');


    // se obtienen categorías por id para tener mejor control
    export const fetchAdminCategoryById = (id: number) => 
        apiRequest<AdminCategory>(`/api/Categorias/${id}`);

    /**
     * Crea una nueva categoría
     * Endpoint: POST /api/Categorias
     * Usado en: CategoryFormPage (modo creación)
     * @param data - Datos de la categoría (sin ID ni slug, se generan en backend)
     */
    export const createCategory = (data: Omit<AdminCategory, 'categoriaId' | 'slug' | 'activo'>) => 
        apiRequest<AdminCategory>('/api/Categorias', 'POST', data);

    /**
     * Actualiza una categoría existente
     * Endpoint: PUT /api/Categorias/{id}
     * Usado en: CategoryFormPage (modo edición)
     * @param id - ID de la categoría a actualizar
     * @param data - Datos completos de la categoría
     */
    export const updateCategory = (id: number, data: AdminCategory) => 
        apiRequest<void>(`/api/Categorias/${id}`, 'PUT', data);

    /**
     * Elimina una categoría
     * Endpoint: DELETE /api/Categorias/{id}
     * Usado en: CategoryListPage (botón eliminar)
     * @param id - ID de la categoría a eliminar
     */
    export const deleteCategory = (id: number) => 
        apiRequest<void>(`/api/Categorias/${id}`, 'DELETE');


    // SECCIÓN 7: API DE ADMINISTRACIÓN - PRODUCTOS

    /**
     * Obtiene TODOS los productos (activos e inactivos) con sus detalles
     * Endpoint: GET /api/Productos
     * Usado en: ProductListPage
     * @returns Lista de productos con categoría y precios incluidos
     */
    export const fetchAdminProducts = async (): Promise<AdminProductSummary[]> => {
        const apiProducts = await apiRequest<any[]>('/api/Productos');
        // Mapear cada producto al formato AdminProductSummary
        return apiProducts.map(mapApiAdminProductSummary);
    };

    /**
     * Obtiene un producto específico por ID con todos sus detalles
     * Endpoint: GET /api/Productos/{id}
     * Usado en: ProductFormPage (modo edición)
     * @param id - ID numérico del producto
     */
    export const fetchAdminProductById = (id: number) => 
        apiRequest<AdminProductDetail>(`/api/Productos/${id}`);

    /**
     * Crea un nuevo producto
     * Endpoint: POST /api/Productos
     * Usado en: ProductFormPage (modo creación)
     * @param data - Datos del producto (sin precios, se agregan después)
     */
    export const createProduct = (data: any) => 
        apiRequest<AdminProductDetail>('/api/Productos', 'POST', data);

    /**
     * Actualiza un producto existente
     * Endpoint: PUT /api/Productos/{id}
     * Usado en: ProductFormPage (modo edición)
     * @param id - ID del producto a actualizar
     * @param data - Datos completos del producto
     */
    export const updateProduct = (id: number, data: any) => 
        apiRequest<void>(`/api/Productos/${id}`, 'PUT', data);

    /**
     * Elimina un producto
     * Endpoint: DELETE /api/Productos/{id}
     * Usado en: ProductListPage (botón eliminar)
     * @param id - ID del producto a eliminar
     */
    export const deleteProduct = (id: number) => 
        apiRequest<void>(`/api/Productos/${id}`, 'DELETE');


    // SECCIÓN 8: API DE ADMINISTRACIÓN - PRECIOS
    // Un producto puede tener múltiples precios (ej: individual, familiar, etc.)

    /**
     * Crea un nuevo precio para un producto
     * Endpoint: POST /api/Precios
     * Usado en: PriceManager (dentro de ProductFormPage)
     * @param data - Datos del precio: productoId, descripcionPrecio, precio
     */
    export const createPrice = (data: { 
        productoId: number; 
        descripcionPrecio: string; 
        precio: number 
    }) => apiRequest<AdminProductPrice>('/api/Precios', 'POST', data);

    /**
     * Actualiza un precio existente
     * Endpoint: PUT /api/Precios/{id}
     * Usado en: PriceManager (botón editar)
     * @param id - ID del precio a actualizar
     * @param data - Nuevos datos del precio (sin el ID)
     */
    export const updatePrice = (id: number, data: Omit<AdminProductPrice, 'productoPrecioId'>) => 
        apiRequest<void>(`/api/Precios/${id}`, 'PUT', data);

    /**
     * Elimina un precio
     * Endpoint: DELETE /api/Precios/{id}
     * Usado en: PriceManager (botón eliminar)
     * @param id - ID del precio a eliminar
     */
    export const deletePrice = (id: number) => 
        apiRequest<void>(`/api/Precios/${id}`, 'DELETE');



    // Este archivo exporta 17 funciones que permiten al frontend comunicarse
    // con el backend C# para gestionar todo el catálogo de la pastelería.