// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVO: components/admin/CategoryFormPage.tsx
// PROPÓSITO: Formulario para crear y editar categorías.
//            Versión simplificada de ProductFormPage (sin precios).
//            Maneja: nombre, descripción, ícono, imagen y estado activo.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    fetchAdminCategoryById,  // Obtener categoría por ID para editar
    createCategory,          // Crear nueva categoría (POST)
    updateCategory          // Actualizar categoría existente (PUT)
} from '../../services/api';
import { AdminCategory } from '../../types';
import ImagePreview from './ImagePreview';
import IconSelector from './IconSelector';

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 1: TIPOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tipo para los datos del formulario de categoría
 * 
 * Omit<AdminCategory, 'categoriaId' | 'slug'>:
 * - Toma AdminCategory y OMITE estos campos:
 *   - categoriaId: Se genera en el backend al crear
 *   - slug: Se genera automáticamente del nombre en el backend
 * 
 * ¿Por qué Omit?
 * - Más limpio que definir manualmente todos los campos
 * - Si AdminCategory cambia, esto se actualiza automáticamente
 * - Type-safe: TypeScript verifica que los campos existan
 * 
 * Campos resultantes:
 * - nombre: string
 * - descripcion: string
 * - icono: string
 * - imagenUrl: string
 * - activo: boolean
 */
type CategoryFormData = Omit<AdminCategory, 'categoriaId' | 'slug'>;

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 2: COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

const CategoryFormPage: React.FC = () => {
    
    // ───────────────────────────────────────────────────────────────────────────
    // HOOKS DE REACT ROUTER
    // ───────────────────────────────────────────────────────────────────────────
    
    /**
     * Obtener el ID de la categoría de la URL
     * 
     * Rutas:
     * - /admin/categories/new → id = undefined (crear nueva)
     * - /admin/categories/edit/3 → id = "3" (editar existente)
     */
    const { id } = useParams<{ id: string }>();
    
    /**
     * Hook para navegar programáticamente
     * Usado para redirigir después de guardar
     */
    const navigate = useNavigate();
    
    /**
     * Determinar si estamos en modo edición o creación
     * 
     * Boolean(id):
     * - Si id existe → true (modo edición)
     * - Si id es undefined → false (modo creación)
     */
    const isEditing = Boolean(id);
    
    // ───────────────────────────────────────────────────────────────────────────
    // ESTADOS DEL COMPONENTE
    // ───────────────────────────────────────────────────────────────────────────
    
    /**
     * Datos del formulario
     * 
     * Valores iniciales para crear nueva categoría:
     * - nombre, descripcion, icono, imagenUrl: strings vacíos
     * - activo: true por defecto (nueva categoría visible)
     * 
     * En modo edición, estos valores se sobrescriben con los datos de la API
     */
    const [formData, setFormData] = useState<CategoryFormData>({
        nombre: '',
        descripcion: '',
        icono: '',
        imagenUrl: '',
        activo: true  // Por defecto activa
    });
    
    /**
     * Estado de carga inicial
     * 
     * Inicialización inteligente:
     * - Si isEditing = true → loading = true (debe cargar datos)
     * - Si isEditing = false → loading = false (no hay nada que cargar)
     * 
     * Esto evita mostrar "Cargando..." cuando creas nueva categoría
     */
    const [loading, setLoading] = useState(isEditing);
    
    /**
     * Mensaje de error para mostrar al usuario
     */
    const [error, setError] = useState<string | null>(null);
    
    /**
     * Estado de envío del formulario
     * true mientras se está guardando en la API
     */
    const [submitting, setSubmitting] = useState(false);

    // ───────────────────────────────────────────────────────────────────────────
    // EFECTO: CARGAR DATOS SI ESTAMOS EDITANDO
    // ───────────────────────────────────────────────────────────────────────────
    
    /**
     * Cargar categoría existente en modo edición
     * 
     * Se ejecuta cuando:
     * - El componente se monta
     * - Cambia el parámetro 'id' en la URL
     * - Cambia isEditing (derivado de id)
     * 
     * Flujo en modo edición:
     * 1. Llamar fetchAdminCategoryById(id)
     * 2. Recibir datos de la categoría
     * 3. Llenar formData con esos datos
     * 4. Si hay error, guardar mensaje
     * 5. Siempre desactivar loading al final
     * 
     * Flujo en modo creación:
     * - No hacer nada (if no se cumple)
     * - loading ya está en false desde el inicio
     */
    useEffect(() => {
        // Solo ejecutar si estamos editando
        if (isEditing && id) {
            fetchAdminCategoryById(Number(id))
                .then(data => {
                    // ✅ ÉXITO: Llenar formulario con datos de la API
                    setFormData({
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        icono: data.icono,
                        imagenUrl: data.imagenUrl,
                        activo: data.activo
                    });
                    // Nota: NO incluimos categoriaId ni slug
                    // El formulario no los necesita
                })
                .catch(err => {
                    // ❌ ERROR: Mostrar mensaje al usuario
                    setError('No se pudo cargar la categoría.');
                })
                .finally(() => {
                    // Siempre desactivar loading (éxito o error)
                    setLoading(false);
                });
        }
    }, [id, isEditing]); // Re-ejecutar si cambia el ID o el modo

    // ───────────────────────────────────────────────────────────────────────────
    // MANEJADORES DE EVENTOS
    // ───────────────────────────────────────────────────────────────────────────

    /**
     * Manejar cambios en los inputs del formulario
     * 
     * Desafío: Checkboxes usan 'checked', otros inputs usan 'value'
     * Solución: Type guard para verificar el tipo de input
     * 
     * Type guard explicado:
     * 1. target instanceof HTMLInputElement
     *    - Verifica que sea un elemento <input> HTML
     *    - Necesario porque puede ser <input> o <textarea>
     * 
     * 2. target.type === 'checkbox'
     *    - Confirma que es específicamente un checkbox
     *    - Porque <input type="text"> también es HTMLInputElement
     * 
     * 3. Si ambos son true:
     *    - TypeScript sabe que 'checked' existe y es válido
     *    - Podemos usarlo sin error de tipo
     * 
     * Sin type guard:
     * - TypeScript no sabe si 'checked' existe
     * - Error: "Property 'checked' does not exist..."
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        
        // Caso especial: checkboxes usan 'checked' (boolean)
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ 
                ...prev, 
                [target.name]: target.checked  // boolean: true/false
            }));
        } else {
            // Todos los demás inputs usan 'value' (string)
            setFormData(prev => ({ 
                ...prev, 
                [target.name]: target.value    // string
            }));
        }
    };
    
    /**
     * Manejar envío del formulario
     * 
     * Flujo completo:
     * 1. Prevenir comportamiento por defecto (no recargar página)
     * 2. Activar estado submitting (deshabilita botón)
     * 3. Limpiar errores previos
     * 4. Decidir si crear o actualizar según isEditing
     * 5. Si es exitoso, navegar a la lista de categorías
     * 6. Si hay error, mostrarlo y reactivar el botón
     */
    const handleSubmit = async (e: React.FormEvent) => {
        // Prevenir recarga de página
        e.preventDefault();
        
        // Iniciar proceso de envío
        setSubmitting(true);
        setError(null);
        
        try {
            if (isEditing && id) {
                // ─────────────────────────────────────────────────────────────
                // MODO EDICIÓN: PUT /api/Categorias/{id}
                // ─────────────────────────────────────────────────────────────
                
                /**
                 * Preparar datos para actualizar
                 * 
                 * Necesitamos un AdminCategory completo:
                 * - ...formData: nombre, descripcion, icono, imagenUrl, activo
                 * - categoriaId: ID numérico de la categoría
                 * - slug: '' (se regenera en el backend si cambió el nombre)
                 * 
                 * ¿Por qué slug: ''?
                 * - El backend ignora el slug que enviemos
                 * - Lo recalcula automáticamente del nombre
                 * - Enviarlo vacío es válido y más claro
                 */
                const categoryData: AdminCategory = { 
                    ...formData, 
                    categoriaId: Number(id),  // Convertir string a number
                    slug: ''                  // Se regenera en backend
                };
                
                await updateCategory(Number(id), categoryData);
            } else {
                // ─────────────────────────────────────────────────────────────
                // MODO CREACIÓN: POST /api/Categorias
                // ─────────────────────────────────────────────────────────────
                
                /**
                 * Crear nueva categoría
                 * 
                 * Solo enviamos formData (sin categoriaId ni slug):
                 * - nombre, descripcion, icono, imagenUrl, activo
                 * 
                 * El backend genera automáticamente:
                 * - categoriaId (autoincremento en BD)
                 * - slug (del nombre: "Pasteles" → "pasteles")
                 */
                await createCategory(formData);
            }
            
            // ✅ ÉXITO: Redirigir a la lista de categorías
            navigate('/admin/categories');
            
        } catch (err: any) {
            // ❌ ERROR: Mostrar mensaje y mantener en el formulario
            setError(err.message || 'Ocurrió un error al guardar.');
            setSubmitting(false);  // Reactivar botón para reintentar
            
            // Nota: No navegamos, el usuario queda en el formulario
            // Puede corregir el error e intentar de nuevo
        }
    };

    // ───────────────────────────────────────────────────────────────────────────
    // EARLY RETURN: Si está cargando, mostrar mensaje
    // ───────────────────────────────────────────────────────────────────────────
    
    /**
     * Mientras loading = true, no mostrar el formulario
     * Solo mostrar un mensaje de carga
     * 
     * Esto solo ocurre en modo edición mientras se cargan los datos
     * En modo creación, loading siempre es false
     */
    if (loading) return <p>Cargando formulario...</p>;

    // ───────────────────────────────────────────────────────────────────────────
    // RENDER DEL FORMULARIO
    // ───────────────────────────────────────────────────────────────────────────

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto">
            {/* Título dinámico según el modo */}
            <h1 className="font-serif-display text-4xl font-bold text-text-primary mb-6">
                {isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </h1>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* FORMULARIO PRINCIPAL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* Campo: Nombre */}
                {/* ─────────────────────────────────────────────────────────── */}
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
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* Campo: Descripción (textarea) */}
                {/* ─────────────────────────────────────────────────────────── */}
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
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* Campo: Ícono (Material Symbols) */}
                {/* ─────────────────────────────────────────────────────────── */}
                {/**
                 * Ícono: Nombre del ícono de Material Symbols
                 * 
                 * Material Symbols es una librería de íconos de Google
                 * Ejemplos de nombres: 'cake', 'cookie', 'bakery_dining'
                 * 
                 * Se usa así en el HTML:
                 * <span class="material-symbols-outlined">{icono}</span>
                 * 
                 * Referencia: https://fonts.google.com/icons
                 */}
                <IconSelector 
                    value={formData.icono}
                    onChange={(iconName) => setFormData(prev => ({ ...prev, icono: iconName }))}
                    id="icono"
                    name="icono"
                />
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* Campo: URL de Imagen */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div>
                    <label htmlFor="imagenUrl" className="block text-sm font-medium text-text-primary">
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
                        placeholder="https://picsum.photos/seed/..." 
                    />
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
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* Checkbox: Categoría Activa */}
                {/* ─────────────────────────────────────────────────────────── */}
                {/**
                 * Checkbox para activar/desactivar la categoría
                 * 
                 * checked={formData.activo}:
                 * - Si activo = true → checkbox marcado
                 * - Si activo = false → checkbox desmarcado
                 * 
                 * onChange={handleChange}:
                 * - Usa el type guard para leer target.checked
                 * - Actualiza formData.activo con boolean
                 */}
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
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* Mensaje de Error */}
                {/* ─────────────────────────────────────────────────────────── */}
                {/**
                 * Mostrar mensaje de error si existe
                 * 
                 * && (operador AND):
                 * - Si error es null → no renderiza nada
                 * - Si error tiene valor → renderiza el <p>
                 * 
                 * Short-circuit evaluation:
                 * {error && <p>{error}</p>}
                 * equivale a:
                 * {error ? <p>{error}</p> : null}
                 */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* ─────────────────────────────────────────────────────────── */}
                {/* Botones de Acción */}
                {/* ─────────────────────────────────────────────────────────── */}
                <div className="flex justify-end gap-4 pt-4">
                    {/* Botón Cancelar */}
                    {/**
                     * Link en lugar de button
                     * - No es un submit, solo navegación
                     * - to="/admin/categories" vuelve a la lista
                     * - No llama handleSubmit
                     */}
                    <Link 
                        to="/admin/categories" 
                        className="bg-gray-200 text-text-secondary font-bold py-2 px-4 rounded-lg transition-colors hover:bg-gray-300"
                    >
                        Cancelar
                    </Link>
                    
                    {/* Botón Guardar */}
                    {/**
                     * type="submit":
                     * - Dispara el evento onSubmit del form
                     * - Llama handleSubmit
                     * 
                     * disabled={submitting}:
                     * - Deshabilita el botón mientras se envía
                     * - Evita doble submit
                     * - Mejor UX
                     * 
                     * Texto dinámico:
                     * - Mientras submitting: "Guardando..."
                     * - Normalmente: "Guardar"
                     */}
                    <button 
                        type="submit" 
                        disabled={submitting} 
                        className="bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryFormPage;