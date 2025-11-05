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
                <div>
                    <label htmlFor="icono" className="block text-sm font-medium text-text-primary">
                        Ícono (Material Symbol)
                    </label>
                    <input 
                        type="text" 
                        name="icono" 
                        id="icono" 
                        value={formData.icono} 
                        onChange={handleChange} 
                        required 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm" 
                        placeholder="Ej: cake" 
                    />
                </div>
                
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

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARACIÓN CON PRODUCTFORMPAGE
// ═══════════════════════════════════════════════════════════════════════════════

/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ SIMILITUDES CON PRODUCTFORMPAGE                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ✅ Misma estructura general:                                                 │
│    - useParams para obtener ID                                               │
│    - isEditing = Boolean(id)                                                 │
│    - Estados: formData, loading, error, submitting                           │
│    - useEffect para cargar datos en modo edición                             │
│    - handleChange con type guard                                             │
│    - handleSubmit con create/update                                          │
│    - Early return si loading                                                 │
│    - Formulario con validación HTML5 (required)                              │
│    - Botones Cancelar y Guardar                                              │
│                                                                               │
│ ✅ Mismos patrones:                                                          │
│    - Omit para el tipo del formulario                                        │
│    - .then().catch().finally() para promises                                 │
│    - Disabled durante submit                                                 │
│    - Navigate después de guardar                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ DIFERENCIAS CON PRODUCTFORMPAGE                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ ❌ MÁS SIMPLE:                                                                │
│    - NO tiene PriceManager (categorías no tienen precios)                    │
│    - NO necesita cargar categorías (es una categoría)                        │
│    - NO tiene select de categoría                                            │
│    - Menos estados (no hay productPrices)                                    │
│    - Menos funciones (no hay loadProductData separada)                       │
│    - Un solo bloque de campos (no múltiples secciones)                       │
│                                                                               │
│ ✅ DIFERENCIAS ESPECÍFICAS:                                                  │
│    - Tiene campo 'icono' (productos no)                                      │
│    - NO tiene campo 'esDeTemporada' (productos sí)                           │
│    - NO tiene select de categoría (productos sí)                             │
│    - Formulario más corto (5 campos vs 7 campos + precios)                  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════════
// FLUJOS DE USO
// ═══════════════════════════════════════════════════════════════════════════════

/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ FLUJO 1: CREAR NUEVA CATEGORÍA                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 1. Admin navega a /admin/categories                                          │
│ 2. Click en "Crear Nueva"                                                    │
│ 3. Navega a /admin/categories/new                                            │
│                                                                               │
│ 4. CategoryFormPage se monta:                                                │
│    - useParams: id = undefined                                               │
│    - isEditing = false                                                       │
│    - loading = false (inicializado con isEditing)                            │
│                                                                               │
│ 5. useEffect NO se ejecuta (if no se cumple)                                │
│                                                                               │
│ 6. Se renderiza formulario vacío:                                            │
│    - Título: "Crear Nueva Categoría"                                         │
│    - Todos los campos vacíos (excepto activo=true)                           │
│                                                                               │
│ 7. Admin llena el formulario:                                                │
│    - Nombre: "Postres Fríos"                                                 │
│    - Descripción: "Refrescantes y cremosos..."                               │
│    - Ícono: "icecream"                                                       │
│    - Imagen URL: "https://..."                                               │
│    - Activo: ✓ (checked)                                                     │
│                                                                               │
│ 8. Click en "Guardar"                                                        │
│ 9. handleSubmit ejecuta:                                                     │
│    - submitting = true (botón se deshabilita)                                │
│    - Llama createCategory(formData)                                          │
│    - POST /api/Categorias                                                    │
│    - Backend genera categoriaId y slug automáticamente                       │
│                                                                               │
│ 10. Backend responde con la categoría creada                                 │
│ 11. navigate('/admin/categories')                                            │
│ 12. Redirige a la lista de categorías                                        │
│ 13. Admin ve la nueva categoría en la lista                                  │
│                                                                               │
│ RESULTADO: ✅ Categoría creada exitosamente                                  │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FLUJO 2: EDITAR CATEGORÍA EXISTENTE                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│ 1. Admin está en /admin/categories (lista de categorías)                    │
│ 2. Click en "Editar" de la categoría con ID 3                               │
│ 3. Navega a /admin/categories/edit/3                                        │
│                                                                               │
│ 4. CategoryFormPage se monta:                                                │
│    - useParams: id = "3"                                                     │
│    - isEditing = true                                                        │
│    - loading = true (inicializado con isEditing)                             │
│                                                                               │
│ 5. Muestra "Cargando formulario..." (early return)                          │
│                                                                               │
│ 6. useEffect ejecuta:                                                        │
│    - Llama fetchAdminCategoryById(3)                                         │
│    - GET /api/Categorias/3                                                   │
│    - Recibe datos de la categoría                                            │
│    - Llena formData con los datos                                            │
│    - loading = false                                                         │
│                                                                               │
│ 7. Re-render con formulario lleno:                                           │
│    - Título: "Editar Categoría"                                              │
│    - Campos pre-llenados con datos actuales                                  │
│                                                                               │
│ 8. Admin modifica campos:                                                    │
│    - Cambia descripción                                                      │
│    - Cambia imagen URL                                                       │
│    - Desmarca "Activo" (desactivar categoría)                                │
│                                                                               │
│ 9. Click en "Guardar"                                                        │
│ 10. handleSubmit ejecuta:                                                    │
│     - submitting = true                                                      │
│     - Prepara categoryData con categoriaId y slug: ''                        │
│     - Llama updateCategory(3, categoryData)                                  │
│     - PUT /api/Categorias/3                                                  │
│     - Backend actualiza y regenera slug si cambió el nombre                  │
│                                                                               │
│ 11. Backend responde con éxito                                               │
│ 12. navigate('/admin/categories')                                            │
│ 13. Redirige a la lista                                                      │
│ 14. Admin ve los cambios reflejados                                          │
│                                                                               │
│ RESULTADO: ✅ Categoría actualizada exitosamente                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
*/

// ═══════════════════════════════════════════════════════════════════════════════
// PREGUNTAS FRECUENTES PARA LA DEFENSA
// ═══════════════════════════════════════════════════════════════════════════════

/*
❓ "¿Por qué el slug se envía vacío en lugar de omitirlo?"
✅ "El backend espera un AdminCategory completo en el PUT, que incluye el campo slug. 
   Enviarlo vacío (slug: '') es más explícito y el backend lo ignora de todos modos, 
   regenerándolo automáticamente del nombre. Es una decisión de diseño de la API: 
   el slug siempre se deriva del nombre para mantener consistencia."

❓ "¿Por qué no hay validación de que el nombre no esté duplicado?"
✅ "La validación de unicidad se hace en el backend, que tiene acceso a la base de datos. 
   Si intentas crear una categoría con nombre duplicado, el backend devuelve un error 
   que se captura en el catch y se muestra al usuario. Validar en el frontend requeriría 
   una llamada extra a la API, agregando latencia innecesaria."

❓ "¿Cómo validarías que el ícono existe en Material Symbols?"
✅ "Mejora futura: Crear un select o autocomplete con la lista de íconos disponibles. 
   Actualmente confío en que el admin escriba el nombre correcto. Si el nombre es 
   inválido, simplemente no se mostrará el ícono en el frontend (Material Symbols 
   muestra un placeholder). No rompe la aplicación, solo se ve mal. Para producción 
   implementaría validación con una lista hardcodeada de íconos válidos."

❓ "¿Por qué Omit en lugar de definir el tipo manualmente?"
✅ "Omit es una utility type de TypeScript que automáticamente crea un nuevo tipo 
   excluyendo campos específicos. Ventajas: 1) Si AdminCategory cambia, este tipo 
   se actualiza automáticamente, 2) Menos código duplicado, 3) Type-safe: TypeScript 
   verifica que los campos excluidos existan en AdminCategory. Es una mejor práctica 
   que escribir todo manualmente."

❓ "¿Cómo mejorarías este formulario?"
✅ "Mejoras que implementaría:
   1. Preview de la imagen en tiempo real mientras escribes la URL
   2. Selector de íconos con preview visual (en lugar de input de texto)
   3. Validación de URL de imagen (formato válido, imagen accesible)
   4. Subida de imágenes a Cloudinary en lugar de URLs
   5. Confirmación antes de salir con cambios sin guardar
   6. Auto-save cada X segundos
   7. Preview del slug que se generará del nombre
   8. Validación async del nombre (verificar si está disponible)
   9. Editor rich text para la descripción
   10. Campo para SEO metadata (meta description)"

❓ "¿Por qué loading se inicializa con isEditing?"
✅ "Es una optimización inteligente:
   - En modo creación (isEditing = false): No hay datos que cargar, loading = false
   - En modo edición (isEditing = true): Hay que cargar datos, loading = true
   
   Sin esto tendríamos que hacer:
   ```
   const [loading, setLoading] = useState(false);
   useEffect(() => {
     if (isEditing) setLoading(true);
     ...
   }, []);
   ```
   
   Inicializarlo correctamente evita un render extra y simplifica el código."

❓ "¿Qué pasa si dos admins editan la misma categoría simultáneamente?"
✅ "Actualmente hay race condition: el último en guardar gana (last-write-wins). 
   Posibles soluciones:
   1. Optimistic locking: Agregar campo 'version' en BD, verificar antes de actualizar
   2. Pessimistic locking: Bloquear el registro mientras alguien lo edita
   3. Notificación: Avisar si alguien más está editando
   4. Merge conflicts: Mostrar cambios conflictivos y permitir resolver manualmente
   
   Para este proyecto con 1-2 admins, no es crítico. En producción con muchos 
   usuarios concurrentes, implementaría optimistic locking."
*/

// ═══════════════════════════════════════════════════════════════════════════════
// MEJORAS FUTURAS
// ═══════════════════════════════════════════════════════════════════════════════

/*
1. SELECTOR DE ÍCONOS
   - Lista visual de Material Symbols
   - Búsqueda/filtrado de íconos
   - Preview del ícono seleccionado
   - Copy-paste del nombre

2. PREVIEW DE IMAGEN
   ```typescript
   {formData.imagenUrl && (
     <img 
       src={formData.imagenUrl} 
       alt="Preview" 
       className="w-32 h-32 rounded-lg mt-2"
       onError={() => setImageError(true)}
     />
   )}
   ```

3. SUBIDA DE IMÁGENES (CLOUDINARY)
   - Componente ImageUploader reutilizable
   - Drag & drop
   - Crop/resize antes de subir
   - Progress bar

4. PREVIEW DEL SLUG
   - Mostrar qué slug se generará
   - Permitir editar manualmente si se desea
   ```typescript
   const previewSlug = formData.nombre
     .toLowerCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/^-+|-+$/g, "");
   ```

5. VALIDACIÓN ASYNC DE NOMBRE
   - Verificar disponibilidad mientras escribes
   - Debounce para no llamar la API en cada tecla
   - Mostrar ✓ si está disponible, ✗ si está en uso

6. AUTO-SAVE
   - Guardar borrador automáticamente
   - Indicador "Todos los cambios guardados"
   - Recuperar borrador si se cierra accidentalmente

7. RICH TEXT EDITOR PARA DESCRIPCIÓN
   - TinyMCE, Quill, o similar
   - Formato básico (negrita, cursiva, listas)
   - Preview de cómo se verá

8. CAMPOS SEO
   - Meta title
   - Meta description
   - OG tags para redes sociales
   - Canonical URL

9. ORDENAMIENTO
   - Campo 'orden' para controlar posición en la lista
   - Drag & drop en la lista para reordenar

10. CATEGORÍAS ANIDADAS (FUTURO)
    - Jerarquía de categorías (padre-hijo)
    - Subcategorías
    - Breadcrumbs: Postres > Fríos > Helados
*/

// ═══════════════════════════════════════════════════════════════════════════════
// DIFERENCIAS CLAVE CON PRODUCTFORMPAGE
// ═══════════════════════════════════════════════════════════════════════════════

/*
┌─────────────────────┬────────────────────────────────────────────────────────┐
│      ASPECTO        │   CategoryFormPage   │   ProductFormPage               │
├─────────────────────┼──────────────────────┼─────────────────────────────────┤
│ Complejidad         │ ⭐⭐ Baja             │ ⭐⭐⭐⭐⭐ Alta               │
│ Líneas de código    │ ~110                 │ ~250+                           │
│ Subcomponentes      │ 0                    │ 1 (PriceManager)                │
│ Campos del form     │ 5                    │ 7 + precios dinámicos           │
│ Estados             │ 4                    │ 6                               │
│ Dependencias API    │ 1 categoría          │ Categorías + Producto + Precios │
│ Funciones           │ 3                    │ 7+                              │
│ Relaciones          │ Ninguna              │ 1:N con Precios                 │
│ CRUD anidado        │ No                   │ Sí (Precios dentro)             │
└─────────────────────┴──────────────────────┴─────────────────────────────────┘

CONCLUSIÓN:
CategoryFormPage es el ejemplo perfecto de un formulario CRUD simple y bien hecho.
ProductFormPage es más complejo por la relación 1:N con precios.
Ambos siguen los mismos patrones y buenas prácticas.
*/

// ═══════════════════════════════════════════════════════════════════════════════
// PATRONES Y BUENAS PRÁCTICAS APLICADAS
// ═══════════════════════════════════════════════════════════════════════════════

/*
✅ SEPARATION OF CONCERNS
   - Lógica de negocio en el componente
   - API calls en services/api.ts
   - Tipos en types.ts
   - Navegación con React Router

✅ TYPE SAFETY
   - TypeScript en todo el código
   - Tipos explícitos para props y estados
   - Type guard para checkboxes
   - Omit para derivar tipos

✅ ERROR HANDLING
   - Try-catch en operaciones async
   - Mensajes de error al usuario
   - Estados de loading y error
   - Fallback si falla la carga

✅ USER EXPERIENCE
   - Loading state mientras carga
   - Disabled durante submit (evita doble submit)
   - Texto dinámico en botones (Guardar vs Guardando...)
   - Navegación después de guardar exitoso
   - Required en campos obligatorios

✅ REACT BEST PRACTICES
   - Hooks correctamente (useState, useEffect)
   - Dependencias correctas en useEffect
   - Controlled components (value + onChange)
   - Key props en listas
   - Cleanup en useEffect (si fuera necesario)

✅ CÓDIGO LIMPIO
   - Nombres descriptivos de variables y funciones
   - Comentarios explicativos
   - Estructura clara y organizada
   - DRY (Don't Repeat Yourself)
   - Consistent code style

✅ PERFORMANCE
   - Early return si loading
   - Inicialización inteligente de loading
   - No re-renders innecesarios
   - Minimal re-renders on change

✅ ACCESSIBILITY
   - Labels con htmlFor
   - Required en campos obligatorios
   - Placeholder text descriptivo
   - Disabled state visual (cursor-not-allowed)
*/

// ═══════════════════════════════════════════════════════════════════════════════
// FIN DEL ARCHIVO
// ═══════════════════════════════════════════════════════════════════════════════
// CategoryFormPage: Formulario CRUD simple pero completo, ejemplo de buenas prácticas