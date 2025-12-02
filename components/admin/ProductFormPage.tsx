// Formulario completo para crear y editar productos.
// Incluye gestión de precios (CRUD completo) mediante PriceManager.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    fetchAdminProductById, // Obtener producto por ID para editar
    createProduct, // Crear nuevo producto (POST)
    updateProduct, // Actualizar producto existente (PUT)
    fetchAdminCategories, // Obtener categorías para el select
    createPrice, // Crear nuevo precio (POST)
    updatePrice, // Actualizar precio existente (PUT)
    deletePrice // Eliminar precio (DELETE)
} from '../../services/api';
import ImagePreview from './ImagePreview'; // - vista previa de imagen
import { AdminCategory, AdminProductPrice } from '../../types';
import ConfirmationModal from './ConfirmationModal'; // - botón de confirmación


// TIPOS Y INTERFACES
// se crea el tipo ProductFormData porque solo necesitamos los datos a editar necesarios

type ProductFormData = {
    nombre: string;
    descripcion: string;
    imagenUrl: string;
    activo: boolean;
    esDeTemporada: boolean;
    categoriaId: number | string;
};

// COMPONENTE PRICEMANAGER  este es un subcomponente
// para gestionar los precios de un producto
// es componente separado porque así dividimos el componente para no hacerlo grande y cada uno su lógica

// prices array de productos
const PriceManager: React.FC<{
    prices: AdminProductPrice[],
    productId: number,
    onPricesUpdate: () => void
}> = ({ prices, productId, onPricesUpdate }) => {
    
    // ESTADOS DEL PRICEMANAGER
    // el estado del formulario agregar nuevo precio
    const [newPrice, setNewPrice] = useState({ 
        descripcionPrecio: '',
        precio: '' // se transforma al enviar
    });
    // estado para el precio a editar, null si no hay uno en edición
    // al hacer editar se muestran input en vez de texto, luego se guarda y vuelve a null ese valor
    
    const [editingPrice, setEditingPrice] = useState<AdminProductPrice | null>(null);
    
    // botón de confirmación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // precio a eliminar, este ya está guardado antes de eliminarse
    const [priceToDelete, setPriceToDelete] = useState<AdminProductPrice | null>(null);

    // FUNCIONES DEL PRICEMANAGER
    // luego de llenar los campos y validarlos se llama al metodo POST
    // limpia el formulario y recarga la lista de precios

    const handleAddPrice = async () => {
        // Validación que no sean null
        if (!newPrice.descripcionPrecio || !newPrice.precio) return;
        
        // Llamar a la API para crear el precio
        await createPrice({
            productoId: productId,
            descripcionPrecio: newPrice.descripcionPrecio,
            precio: parseFloat(newPrice.precio)  // Convertir string a number porque ya hay datos
        });
        
        // Limpiar el formulario
        setNewPrice({ descripcionPrecio: '', precio: '' });
        
        // Recargar datos del producto con los precios actualizados
        onPricesUpdate();
    };

    // para actualizar un precio existente se activa modo edición editingPrice
    // se modifica los input y se llama a la api con PUT para editarlos
    // recarga la lista
    const handleUpdatePrice = async () => {
        if (!editingPrice) return; // No hay nada en edición
        
        // Llamar a la API para actualizar
        await updatePrice(editingPrice.productoPrecioId, {
            descripcionPrecio: editingPrice.descripcionPrecio,
            precio: editingPrice.precio
        });
        
        // Salir del modo edición
        setEditingPrice(null);
        
        // Recargar datos
        onPricesUpdate();
    };
    
    // preparar eliminación
    // no eliminar inmediatamente, primero preguntar al usuario con confirmación
    const handleDeleteClick = (price: AdminProductPrice) => {
        setPriceToDelete(price); // Guardar qué precio se va a eliminar
        setShowDeleteModal(true); // Mostrar el boton
    };

    // confirmar eliminar producto
    // se ejecuta petición a la api
    const handleConfirmDelete = async () => {
        if (!priceToDelete) return;
        
        // Eliminar de la API
        await deletePrice(priceToDelete.productoPrecioId);
        
        // Limpiar estados y cerrar botones
        setShowDeleteModal(false);
        setPriceToDelete(null);
        
        // Recargar datos
        onPricesUpdate();
    };

    // RENDER DEL PRICEMANAGER
    // este ya es el diseño
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">Precios</h3>
            
            {/* LISTA DE PRECIOS EXISTENTES */}
            <ul className="space-y-2">
                {/*mapeo de los datos*/}
                {prices.map(price => (
                    <li 
                        key={price.productoPrecioId} 
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                    >
                        {/* MODO EDICIÓN: Muestra inputs  para editar*/}
                        {editingPrice?.productoPrecioId === price.productoPrecioId ? (
                            <>
                                {/* Input de descripción */}
                                <input 
                                    type="text" 
                                    value={editingPrice.descripcionPrecio} 
                                    onChange={e => setEditingPrice({
                                        ...editingPrice, 
                                        descripcionPrecio: e.target.value
                                    })} 
                                    className="flex-grow rounded-md border-gray-300 shadow-sm text-sm" 
                                    placeholder="Descripción"
                                />
                                
                                {/* Input de precio */}
                                <input 
                                    type="number" 
                                    value={editingPrice.precio} 
                                    onChange={e => setEditingPrice({
                                        ...editingPrice, 
                                        precio: parseFloat(e.target.value)
                                    })} 
                                    className="w-24 rounded-md border-gray-300 shadow-sm text-sm" 
                                    placeholder="Precio"
                                />
                                
                                {/* Botón Guardar */}
                                <button 
                                    onClick={handleUpdatePrice} 
                                    className="text-green-600 hover:text-green-800 p-1"
                                >
                                    <span className="material-symbols-outlined">check</span>
                                </button>
                                
                                {/* Botón Cancelar*/}
                                <button 
                                    onClick={() => setEditingPrice(null)} 
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* MODO NORMAL para agregar Muestra texto */}
                                {/* Mostrar descripción y precio */}
                                <span className="flex-grow text-sm">
                                    {price.descripcionPrecio} - <strong>${price.precio.toFixed(2)}</strong>
                                </span>
                                
                                {/* Botón Editar */}
                                <button 
                                    onClick={() => setEditingPrice(price)} 
                                    className="text-secondary hover:text-secondary/80 p-1"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                
                                {/* Botón Eliminar */}
                                <button 
                                    onClick={() => handleDeleteClick(price)} 
                                    className="text-red-600 hover:text-red-900 p-1"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {/* FORMULARIO PARA AGREGAR NUEVO PRECIOO */}
            <div className="flex items-center gap-2 pt-2 border-t">
                {/* Input descripción */}
                <input 
                    type="text" 
                    value={newPrice.descripcionPrecio} 
                    onChange={e => setNewPrice({ 
                        ...newPrice, 
                        descripcionPrecio: e.target.value 
                    })} 
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm" 
                    placeholder="Descripción (ej. 1 porción)" 
                />
                
                {/* Input precio */}
                <input 
                    type="number" 
                    value={newPrice.precio} 
                    onChange={e => setNewPrice({ 
                        ...newPrice, 
                        precio: e.target.value 
                    })} 
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm" 
                    placeholder="Precio" 
                />
                
                {/* Botón agregar */}
                <button 
                    type="button" 
                    onClick={handleAddPrice} 
                    className="bg-secondary text-white font-bold py-2 px-3 rounded-lg text-sm transition-transform hover:scale-105"
                >
                    +
                </button>
            </div>
            {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
            <ConfirmationModal 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                onConfirm={handleConfirmDelete} 
                title="Eliminar Precio" 
                message="¿Seguro que quieres eliminar este precio?" 
            />
        </div>
    );
};

// SECCIÓN 3: COMPONENTE PRINCIPAL de producto
const ProductFormPage: React.FC = () => {
    
    // HOOKS DE REACT ROUTER
    // se definnen las rutas para crear nuevo o editar
    // /admin/products/new → id = undefined crear nuevo
    // /admin/products/edit/5 → id = "5" editar existente
    
    const { id } = useParams<{ id: string }>();
    
    // redirige luego de guardar
    const navigate = useNavigate();
    
    // se determina si se está editando o creando
    const isEditing = Boolean(id);
    
    // ESTADOS DEL COMPONENTE
    // precios del producto solo en modo edición
    // en modo creación está vacío

    const [productPrices, setProductPrices] = useState<AdminProductPrice[]>([]);
    
    // categorías disponibles para el select al montar el componente
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    
    // datos de formulario iniciales para nuevo producto
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: '',
        descripcion: '',
        imagenUrl: '',
        activo: true,
        esDeTemporada: false,
        categoriaId: '' // Sin categoría seleccionada
    });
    
    // mientras se cargan las categorías
    const [loading, setLoading] = useState(true);
    
    // si no carga entonecs mensaje de error
    const [error, setError] = useState<string | null>(null);
    // envío del formulario mientras se carga en la api
    const [submitting, setSubmitting] = useState(false);
    
    // Estados para la subida de imágenes
    const [imageSourceType, setImageSourceType] = useState('url'); // 'url' o 'upload'
    const [imageUploading, setImageUploading] = useState(false);


    // FUNCIONES DE CARGA DE DATOS
    // es async y puede llamar desde useEffect
    // se usa como callback para recargar después de los cambios

    const loadProductData = async () => {
        // Solo cargar si estamos editando
        if (isEditing && id) {
             try {
                // Obtener producto completo por ID
                const data = await fetchAdminProductById(Number(id));
                
                // Llenar el formulario con los datos del producto
                setFormData({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    imagenUrl: data.imagenUrl,
                    activo: data.activo,
                    esDeTemporada: data.esDeTemporada,
                    categoriaId: data.categoria.categoriaId,  // Del objeto completo tomamos solo el ID
                });
                
                // Guardar los precios para PriceManager
                setProductPrices(data.productoPrecios);
                
             } catch (err) {
                 setError('No se pudo cargar el producto.');
             }
        }
    };

    // useEffect carga los datos iniciales para montar componente | se ejecuta una vez
    // cambia si se edita, tiene dependencias
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                
                // Cargar categorías
                const cats = await fetchAdminCategories();
                setCategories(cats);
                
                // Si hay categorías y estamos creando,
                // seleccionar la primera automáticamente
                if (cats.length > 0 && !isEditing) {
                    setFormData(prev => ({
                        ...prev, 
                        categoriaId: cats[0].categoriaId
                    }));
                }
                
                // Si estamos editando, cargar el producto
                await loadProductData();
                
            } catch (err) {
                setError('No se pudieron cargar los datos necesarios.');
            } finally {
                // Siempre desactivar loading (éxito o error)
                setLoading(false);
            }
        };
        
        loadInitialData();
    }, [id, isEditing]); // Re-ejecutar si cambia el ID o el modo

    // MANEJADORES DE EVENTOS
    // los input deben traer los valores
    // se instancian de los checkbox los tipos  para ver si es true o falso

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        
        // se usa checket
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ 
                ...prev, 
                [target.name]: target.checked  // boolean: true/false
            }));
        } else {
            // Todos los demás inputs usan value
            setFormData(prev => ({ 
                ...prev, 
                [target.name]: target.value    // string
            }));
        }
    };

    // integracion con cloudinary
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset || cloudName === "your_cloud_name") {
            setError("La configuración de Cloudinary no está completa revisa tus variables de entorno en el archivo .env");
            return;
        }

        setImageUploading(true);
        setError(null);

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen.');
            }

            const data = await response.json();
            
            setFormData(prev => ({
                ...prev,
                imagenUrl: data.secure_url
            }));

        } catch (err: any) {
            setError(err.message || "No se pudo subir la imagen.");
        } finally {
            setImageUploading(false);
        }
    };

    // manejo de formulario
    
    const handleSubmit = async (e: React.FormEvent) => {
        // Prevenir recarga de página
        e.preventDefault();
        
        // Validación: Debe haber una categoría seleccionada
        if (!formData.categoriaId) {
            setError("Por favor, selecciona una categoría.");
            return;
        }
        
        // Iniciar proceso de envío
        setSubmitting(true);
        setError(null);
        
        // Preparar datos para enviar
        // Convertir categoriaId a number porque viene un string vacío
        const dataToSend = { 
            ...formData, 
            categoriaId: Number(formData.categoriaId) 
        };

        try {
            if (isEditing && id) {
                // edición de productos
                await updateProduct(Number(id), { 
                    productoId: Number(id),  // el id del cuerpo
                    ...dataToSend 
                });
            } else {
                // creación del producto
                await createProduct(dataToSend);
            }
            
            // si todo va bien redirige a la lista de productos
            navigate('/admin/products');
            
        } catch (err: any) {
            // Si hay error mostrar mensaje y mantener en el formulario
            setError(err.message || 'Ocurrió un error al guardar.');
            setSubmitting(false);  // se activa botón para reintentar 
        }
    };

    // Si está cargando, mostrar mensaje
    // esto evita mostrar un formulario vacío mientras cargan los datos
    if (loading) return <p>Cargando formulario...</p>;

    // RENDER DEL FORMULARIO COMPLETO
    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            {/* Título dinámico según edición o creación */}
            <h1 className="font-serif-display text-4xl font-bold text-text-primary mb-6">
                {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h1>
            {/* FORMULARIO PRINCIPAL */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/*INFORMACIÓN DEL PRODUCTO */}
                <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <h2 className="text-xl font-bold font-serif-display border-b pb-2">
                        Información del Producto
                    </h2>

                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-text-primary">
                            Nombre
                        </label>
                        <input 
                            type="text" 
                            name="nombre" 
                            id="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm" 
                        />
                    </div>
                    
                    {/*categoría*/}
                    <div>
                        <label htmlFor="categoriaId" className="block text-sm font-medium text-text-primary">
                            Categoría
                        </label>
                        <select 
                            name="categoriaId" 
                            id="categoriaId" 
                            value={formData.categoriaId} 
                            onChange={handleChange} 
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        >
                            <option value="" disabled>Selecciona una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.categoriaId} value={cat.categoriaId}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/*descripción*/}
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-text-primary">
                            Descripción
                        </label>
                        <textarea 
                            name="descripcion" 
                            id="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            rows={4} 
                            required 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                        ></textarea>
                    </div>
                    
                    {/* SECCIÓN DE IMAGEN CON OPCIÓN DE SUBIDA */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Imagen del Producto
                        </label>

                        {/* Selector de tipo de imagen: URL o Subida */}
                        <div className="flex items-center gap-4 mb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio"
                                    name="imageSource"
                                    value="url"
                                    checked={imageSourceType === 'url'}
                                    onChange={() => setImageSourceType('url')}
                                    className="h-4 w-4 text-secondary focus:ring-secondary"
                                />
                                <span className="text-sm">Usar URL</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio"
                                    name="imageSource"
                                    value="upload"
                                    checked={imageSourceType === 'upload'}
                                    onChange={() => setImageSourceType('upload')}
                                    className="h-4 w-4 text-secondary focus:ring-secondary"
                                />
                                <span className="text-sm">Subir archivo</span>
                            </label>
                        </div>
                        
                        {/* Render condicional input de URL o de archivo */}
                        {imageSourceType === 'url' ? (
                             <div>
                                <label htmlFor="imagenUrl" className="block text-sm font-medium text-gray-500">
                                    URL de la Imagen
                                </label>
                                <input 
                                    type="text" 
                                    name="imagenUrl" 
                                    id="imagenUrl" 
                                    value={formData.imagenUrl} 
                                    onChange={handleChange} 
                                    required 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm" 
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-500">
                                    Seleccionar archivo
                                </label>
                                <input 
                                    type="file"
                                    id="imageUpload"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleImageUpload}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
                                />
                                {imageUploading && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-secondary"></div>
                                        <span>Subiendo imagen...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Vista previa */}
                        {formData.imagenUrl && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                                <ImagePreview 
                                    imageUrl={formData.imagenUrl} 
                                    alt={formData.nombre || 'Producto'} 
                                    className="w-48 h-48"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* checkbox de  Activo y De Temporada */}
                    <div className="flex space-x-8">
                        {/* Checkbox Producto Activo */}
                        <div className="flex items-center">
                            <input 
                                id="activo" 
                                name="activo" 
                                type="checkbox" 
                                checked={formData.activo} 
                                onChange={handleChange} 
                                className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary" 
                            />
                            <label htmlFor="activo" className="ml-2 block text-sm text-text-primary">
                                Producto Activo
                            </label>
                        </div>
                        
                        {/*Es de Temporada */}
                        <div className="flex items-center">
                            <input 
                                id="esDeTemporada" 
                                name="esDeTemporada" 
                                type="checkbox" 
                                checked={formData.esDeTemporada} 
                                onChange={handleChange} 
                                className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary" 
                            />
                            <label htmlFor="esDeTemporada" className="ml-2 block text-sm text-text-primary">
                                Es de Temporada
                            </label>
                        </div>
                    </div>
                </div>
                {/* PRECIOS SOLO EN MODO EDICIÓN*/}
                {isEditing && id && (
                     <div className="bg-white p-8 rounded-lg shadow-md">
                        <PriceManager 
                            prices={productPrices}
                            productId={Number(id)}
                            onPricesUpdate={loadProductData}
                        />
                     </div>
                )}
                {/* MENSAJE DE ERROR */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-4 pt-4">
                    {/* botón Cancelar */}
                    <Link 
                        to="/admin/products" 
                        className="bg-gray-200 text-text-secondary font-bold py-2 px-4 rounded-lg transition-colors hover:bg-gray-300"
                    >
                        Cancelar
                    </Link>
                    
                    {/* botón Guardar */}
                    <button 
                        type="submit" 
                        disabled={submitting || imageUploading} 
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Guardando...' : (imageUploading ? 'Esperando imagen...' : 'Guardar Producto')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;