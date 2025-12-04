// clases necesarias
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminCategories, deleteCategory } from '../../services/api';
import { AdminCategory } from '../../types';
import ConfirmationModal from './ConfirmationModal';

const CategoryListPage: React.FC = () => {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAdminCategories();
            setCategories(data);
        } catch (err: any) {
            setError('No se pudieron cargar las categorías.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);
    
    const handleDeleteClick = (category: AdminCategory) => {
        setCategoryToDelete(category);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        
        try {
            await deleteCategory(categoryToDelete.categoriaId);
            setShowModal(false);
            setCategoryToDelete(null);
            setNotification({ type: 'success', message: 'Categoría eliminada con éxito.' });
            loadCategories(); // Recargar la lista
        } catch (err: any) {
            setShowModal(false);
            setNotification({ type: 'error', message: `Error al eliminar: ${err.message}` });
        }
    };
    
     useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <>
            <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="font-serif-display text-4xl font-bold text-text-primary">Categorías</h1>
                    <Link to="/admin/categories/new" className="bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105">
                        + Crear Categoría
                    </Link>
                </div>
                <div className="md:hidden bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">swipe</span>
                        Desliza para ver más columnas
                </div>
                {loading && <p>Cargando categorías...</p>}
                {error && <p className="text-red-500">{error}</p>}
                
                {!loading && !error && (
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Imagen</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Nombre</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Descripción</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Ícono</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Estado</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((cat) => (
                                    <tr key={cat.categoriaId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={cat.imagenUrl} alt={cat.nombre} className="w-10 h-10 rounded-md object-cover" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-text-primary">{cat.nombre}</div>
                                            <div className="text-xs text-text-secondary">{cat.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-text-secondary max-w-xs truncate" title={cat.descripcion}>
                                                {cat.descripcion}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="material-symbols-outlined text-text-secondary">{cat.icono}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cat.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {cat.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link to={`/admin/categories/edit/${cat.categoriaId}`} className="text-secondary hover:text-secondary/80">Editar</Link>
                                            <button onClick={() => handleDeleteClick(cat)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar la categoría "${categoryToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            />

            {notification && (
                 <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} ${notification ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    {notification.message}
                </div>
            )}
        </>
    );
};

export default CategoryListPage;
