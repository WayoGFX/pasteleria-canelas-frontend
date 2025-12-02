// fomrulario para crear y editar categorías
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    fetchAdminCategoryById, // Obtener categoría por ID para editar
    createCategory, // Crear nueva categoría (POST)
    updateCategory // Actualizar categoría existente (PUT)
} from '../../services/api';
import { AdminCategory } from '../../types';
import ImagePreview from './ImagePreview';
import IconSelector from './IconSelector';

// los tipos de datos permiten tener el id, slug
type CategoryFormData = Omit<AdminCategory, 'categoriaId' | 'slug'>;

// COMPONENTE PRINCIPAL
const CategoryFormPage: React.FC = () => {
    // HOOKS DE REACT ROUTER
    // se obtiene el id de la url
    const { id } = useParams<{ id: string }>();
    
    // hook para navegar, redirige luego de guardar
    const navigate = useNavigate();
    
    // verifica si se está editando o creando para activar las funciones
    const isEditing = Boolean(id);

    // ESTADOS DEL COMPONENTE
    // datos del formulario | en modo de edición se sobreescriben con los datos de la api
    const [formData, setFormData] = useState<CategoryFormData>({
        nombre: '',
        descripcion: '',
        icono: '',
        imagenUrl: '',
        activo: true // Por defecto activa
    });

    // cargar estado inicial
    const [loading, setLoading] = useState(isEditing);

    // mensaje de error
    const [error, setError] = useState<string | null>(null);
    
    // estado de envio de formulario
    const [submitting, setSubmitting] = useState(false);

    // Estados para la subida de imágenes
    const [imageSourceType, setImageSourceType] = useState('url'); // 'url' o 'upload'
    const [imageUploading, setImageUploading] = useState(false);

    // Cargar datos si se edita        EFECTO: CARGAR DATOS SI ESTAMOS EDITANDO
    
    // llama a fetchAdmin, recibe los datos y llena los formdata con esos datos
    useEffect(() => {
        // Solo ejecutar si estamos editando
        if (isEditing && id) {
            fetchAdminCategoryById(Number(id))
                .then(data => {
                    // llenar formulario con datos de la API
                    setFormData({
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        icono: data.icono,
                        imagenUrl: data.imagenUrl,
                        activo: data.activo
                    });
                    // no incluimos categoriaId ni slug porque cno se editan
                })
                .catch(err => {
                    // mensaje de error
                    setError('No se pudo cargar la categoría.');
                })
                .finally(() => {
                    // loading se activa siempre
                    setLoading(false);
                });
        }
    }, [id, isEditing]); // re-ejecutar si cambia el ID o el modo

    // MANEJADORES DE EVENTOS

    // se usa checked para verificar el tipo de input
    // este confirma que es un checkbot porque el tipo text es de htmlinputelement
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        
        // checkboxes usan boolean
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ 
                ...prev, 
                [target.name]: target.checked // boolean true or false
            }));
        } else {
            // Todos los demás inputs usan string
            setFormData(prev => ({ 
                ...prev, 
                [target.name]: target.value // string
            }));
        }
    };
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset || cloudName === "your_cloud_name") {
            setError("La configuración de Cloudinary no está completa, revisa tus variables de entorno en el archivo .env");
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

    // no recarga página, activa el estabo submitting
    // decide si actualizar o crear según isEditing
    const handleSubmit = async (e: React.FormEvent) => {
        // prevenir recarga de página
        e.preventDefault();
        
        // Iniciar proceso de envío
        setSubmitting(true);
        setError(null);
        try {
            if (isEditing && id) {
                // MODO EDICIÓN PUT /api/Categorias/{id}
                
                // se necesitan los datos, no se envía el slug porque lo hace el backend
                const categoryData: AdminCategory = { 
                    ...formData, 
                    categoriaId: Number(id), // Convertir string a number porque venía null
                    slug: '' // Se regenera en backend
                };
                
                await updateCategory(Number(id), categoryData);
            } else {
                // MODO CREACIÓN POST /api/Categorias
                // crear una categoría, el id y slug lo genera el backend
                await createCategory(formData);
            }
            
            // redirigir a la lista de categorías
            navigate('/admin/categories');
            
        } catch (err: any) {
            // mostrar mensaje y mantener en el formulario
            setError(err.message || 'Ocurrió un error al guardar.');
            setSubmitting(false);  // reactivar botón para reintentar
        }
    };


    // si está cargando, mostrar mensaje
    // osea mientras carga los datos está en modo loading, este en modo edición
    if (loading) return <p>Cargando formulario...</p>;

    // RENDER DEL FORMULARIO
    return (
        <div className="animate-fadeIn max-w-2xl mx-auto">
            {/* Título dinámico según el modo */}
            <h1 className="font-serif-display text-4xl font-bold text-text-primary mb-6">
                {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </h1>
            {/* FORMULARIO PRINCIPAL */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
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
                {/*Descripción (textarea) */}
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-text-primary">
                        Descripción
                    </label>
                    <textarea 
                        name="descripcion" 
                        id="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        rows={3} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                    ></textarea>
                </div>

                {/* Ícono Material Symbols */}
                <IconSelector 
                    value={formData.icono}
                    onChange={(iconName) => setFormData(prev => ({ ...prev, icono: iconName }))}
                    id="icono"
                    name="icono"
                />        
                
                {/* SECCIÓN DE IMAGEN CON OPCIÓN DE SUBIDA */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        Imagen de la Categoría
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
                    
                    {/* Render condicional: input de URL o de archivo */}
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
                                alt={formData.nombre || 'Categoría'} 
                                className="w-48 h-48"
                            />
                        </div>
                    )}
                </div>

                {/*Categoría Activa */}
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
                        Categoría Activa
                    </label>
                </div>
                {/* Mensaje de Error */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {/* Botones de Acción */}
                <div className="flex justify-end gap-4 pt-4">
                    {/* Botón Cancelar */}
                    <Link 
                        to="/admin/categories" 
                        className="bg-gray-200 text-text-secondary font-bold py-2 px-4 rounded-lg transition-colors hover:bg-gray-300"
                    >Cancelar</Link>           
                    {/* Botón Guardar */}
                    <button 
                        type="submit" 
                        disabled={submitting || imageUploading} 
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Guardando...' : (imageUploading ? 'Esperando imagen...' : 'Guardar')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryFormPage;