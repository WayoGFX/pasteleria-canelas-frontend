// Lista todos los productos en una tabla con opciones para editar/eliminar.
// Incluye filtrado visual, notificaciones y modal de confirmación.


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    fetchAdminProducts, // Obtener todos los productos
    deleteProduct, // Eliminar producto por ID
    fetchAdminCategories // Obtener categorías 
} from '../../services/api';
import { AdminProductSummary, AdminCategory } from '../../types';
import ConfirmationModal from './ConfirmationModal';

const ProductListPage: React.FC = () => {
    
    // ESTADOS
    
    const [products, setProducts] = useState<AdminProductSummary[]>([]);
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para el modal de eliminación
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<AdminProductSummary | null>(null);
    
    // Estado para notificaciones de realizado o error
    const [notification, setNotification] = useState<{ 
        type: 'success' | 'error', 
        message: string 
    } | null>(null);

    // OPTIMIZACIÓN DE CATEGORÍAS
    // se mapea para obtener el nombre rápido y evitar recrear el objeto a cada rato
    const categoryMap = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat.categoriaId] = cat.nombre;
            return acc;
        }, {} as Record<number, string>);
    }, [categories]);

    // FUNCIÓN DE CARGAR DATOS
    // Cargar productos y categorías en paralelo, así se usa la función sin recrearla y hacer varias llamadas a la vez
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Cargar productos y categorías en paralelo | más rápido
            const [productsData, categoriesData] = await Promise.all([
                fetchAdminProducts(),
                fetchAdminCategories()
            ]);
            
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err: any) {
            setError('No se pudieron cargar los datos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // cargar los datos al componente
    useEffect(() => {
        loadData();
    }, [loadData]);

    // MANEJADORES DE ELIMINACIÓN

    // mostrar botones de confirmación
    const handleDeleteClick = (product: AdminProductSummary) => {
        setProductToDelete(product);
        setShowModal(true);
    };
    // ejecutar eliminar
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        
        try {
            await deleteProduct(productToDelete.productoId);
            setShowModal(false);
            setProductToDelete(null);
            setNotification({ 
                type: 'success', 
                message: 'Producto eliminado con éxito.' 
            });
            loadData(); // recargar lista
        } catch (err: any) {
            setShowModal(false);
            setNotification({ 
                type: 'error', 
                message: `Error al eliminar: ${err.message}` 
            });
        }
    };
    // notificación de accion realizada despues de 4 segundakos
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // RENDER DE CONTENIDO
    return (
        <>
            <div className="animate-fadeIn">
                {/* HEADER CON TÍTULO Y BOTÓN */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="font-serif-display text-4xl font-bold text-text-primary">
                        Productos
                    </h1>
                    <Link 
                        to="/admin/products/new" 
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
                    >
                        + Crear Producto
                    </Link>
                </div>
                <div className="md:hidden bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">swipe</span>
                        Desliza para ver más columnas
                </div>
                {/* ESTADOS DE CARGA DE DATOS Y ERROR */}
                {loading && <p>Cargando productos...</p>}
                {error && <p className="text-red-500">{error}</p>}
                
                {/* TABLA DE PRODUCTOS */}
                {!loading && !error && (
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* TABLAA*/}
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Precios
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            {/* FILAS DE PRODUCTOS DATOS */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((prod) => (
                                    <tr key={prod.productoId}>
                                        
                                        {/* Producto imagen + nombre + slug */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {/* imagen */}
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img 
                                                        className="h-10 w-10 rounded-full object-cover" 
                                                        src={prod.imagenUrl} 
                                                        alt={prod.nombre} 
                                                    />
                                                </div>
                                                {/* nombre y slug */}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-text-primary">
                                                        {prod.nombre}
                                                    </div>
                                                    <div className="text-xs text-text-secondary">
                                                        {prod.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p 
                                                className="text-sm text-text-secondary max-w-xs truncate" 
                                                title={prod.descripcion}
                                            >
                                                {prod.descripcion}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-primary">
                                                {categoryMap[prod.categoriaId] || 'N/A'}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap space-y-1">
                                            {/* Activo/Inactivo */}
                                            <span className={`block w-fit px-2 text-xs leading-5 font-semibold rounded-full ${
                                                prod.activo 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {prod.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                            
                                            {/* Temporada/Regular */}
                                            <span className={`block w-fit px-2 text-xs leading-5 font-semibold rounded-full ${
                                                prod.esDeTemporada 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {prod.esDeTemporada ? 'Temporada' : 'Regular'}
                                            </span>
                                        </td>
                                        
                                        {/* cantidad de precios */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-text-primary">
                                            {prod.productoPrecios.length}
                                        </td>
                                        
                                        {/* acciones Editar y Eliminar */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {/* Link a editar */}
                                            <Link 
                                                to={`/admin/products/edit/${prod.productoId}`} 
                                                className="text-secondary hover:text-secondary/80"
                                            >
                                                Editar
                                            </Link>
                                            
                                            {/* botón eliminar*/}
                                            <button 
                                                onClick={() => handleDeleteClick(prod)} 
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            {/* MODAL DE CONFIRMACIÓN */}
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            />
            {/* NOTIFICACIÓN FLOTANTE */}
            {notification && (
                 <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ${
                     notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                 } ${notification ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    {notification.message}
                </div>
            )}
        </>
    );
};

export default ProductListPage;