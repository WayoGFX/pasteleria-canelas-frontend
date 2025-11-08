import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANTES DE ANIMACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: index * 0.1,
            duration: 0.4,
            ease: "easeOut"
        }
    })
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

const AdminDashboard: React.FC = () => {
    return (
        <div className="animate-fadeIn max-w-4xl">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* HEADER CON TÍTULO Y DESCRIPCIÓN */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="font-serif-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
                    Bienvenido al Panel de Canela
                </h1>
                <p className="text-text-secondary text-sm md:text-base mb-6 md:mb-8">
                    Desde aquí puedes gestionar las categorías, productos y precios de tu catálogo.
                </p>
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* GRID DE CARDS (1 col móvil, 2 cols desktop) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* CARD: Gestionar Categorías */}
                {/* ─────────────────────────────────────────────────────────── */}
                <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link 
                        to="categories" 
                        className="group block p-4 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start md:items-center gap-3 md:gap-4">
                            {/* Ícono */}
                            <div className="flex-shrink-0 p-2 md:p-3 bg-accent/20 rounded-full text-secondary">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">
                                    category
                                </span>
                            </div>
                            
                            {/* Contenido */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg md:text-xl font-bold text-text-primary mb-1">
                                    Gestionar Categorías
                                </h2>
                                <p className="text-xs md:text-sm text-text-secondary line-clamp-2">
                                    Crear, editar y organizar las secciones de tu menú.
                                </p>
                            </div>
                            
                            {/* Flecha (oculta en móvil pequeño) */}
                            <motion.span 
                                className="hidden sm:block material-symbols-outlined text-text-secondary flex-shrink-0"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                arrow_forward
                            </motion.span>
                        </div>
                    </Link>
                </motion.div>
                
                {/* ─────────────────────────────────────────────────────────── */}
                {/* CARD: Gestionar Productos */}
                {/* ─────────────────────────────────────────────────────────── */}
                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link 
                        to="products" 
                        className="group block p-4 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start md:items-center gap-3 md:gap-4">
                            {/* Ícono */}
                            <div className="flex-shrink-0 p-2 md:p-3 bg-accent/20 rounded-full text-secondary">
                                <span className="material-symbols-outlined text-2xl md:text-3xl">
                                    inventory_2
                                </span>
                            </div>
                            
                            {/* Contenido */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg md:text-xl font-bold text-text-primary mb-1">
                                    Gestionar Productos
                                </h2>
                                <p className="text-xs md:text-sm text-text-secondary line-clamp-2">
                                    Añadir nuevos postres y administrar sus precios y detalles.
                                </p>
                            </div>
                            
                            {/* Flecha (oculta en móvil pequeño) */}
                            <motion.span 
                                className="hidden sm:block material-symbols-outlined text-text-secondary flex-shrink-0"
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                arrow_forward
                            </motion.span>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SECCIÓN OPCIONAL: Tips rápidos (nuevo) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <motion.div
                className="mt-8 p-4 md:p-6 bg-blue-50 border border-blue-200 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600 flex-shrink-0 mt-0.5">
                        info
                    </span>
                    <div>
                        <h3 className="font-bold text-text-primary mb-2 text-sm md:text-base">
                            💡 Tips rápidos
                        </h3>
                        <ul className="space-y-1 text-xs md:text-sm text-text-secondary">
                            <li>• Primero crea las <strong>categorías</strong>, luego los productos</li>
                            <li>• Puedes <strong>desactivar</strong> categorías/productos sin eliminarlos</li>
                            <li>• Las imágenes deben ser URLs públicas (ej: desde Imgur o Google Drive)</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;

/* ═══════════════════════════════════════════════════════════════════════════════
   MEJORAS IMPLEMENTADAS PARA RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════════

   ✅ TÍTULO:
   - Responsive: text-3xl md:text-4xl
   - Mejor legibilidad en móvil

   ✅ DESCRIPCIÓN:
   - Tamaño responsive: text-sm md:text-base
   - Margin responsive: mb-6 md:mb-8

   ✅ GRID:
   - Gap responsive: gap-4 md:gap-6
   - Más compacto en móvil

   ✅ CARDS:
   - Padding responsive: p-4 md:p-6
   - Items-start en móvil (mejor alineación)
   - Items-center en desktop

   ✅ ÍCONOS:
   - Padding responsive: p-2 md:p-3
   - Tamaño responsive: text-2xl md:text-3xl
   - flex-shrink-0 para mantener tamaño

   ✅ CONTENIDO:
   - flex-1 min-w-0 para prevenir overflow
   - Título: text-lg md:text-xl
   - Descripción: text-xs md:text-sm
   - line-clamp-2 para limitar a 2 líneas

   ✅ FLECHA:
   - hidden sm:block (solo visible desde 640px)
   - Animación con Framer Motion
   - flex-shrink-0 para mantener posición

   ✅ ANIMACIONES:
   - Stagger animation en cards (delay 0.1s)
   - Fade in del header
   - Hover en flechas

   ✅ NUEVA SECCIÓN:
   - Tips rápidos con ícono de info
   - Padding responsive
   - Texto responsive
   - Animación de entrada

   ═══════════════════════════════════════════════════════════════════════════════
   BREAKPOINTS
   ═══════════════════════════════════════════════════════════════════════════════

   📱 MÓVIL (<640px):
   - 1 columna
   - Sin flecha
   - Padding p-4
   - Texto más pequeño

   📱 MÓVIL+ (640px-768px):
   - 1 columna
   - Con flecha
   - Padding p-4
   - Texto más pequeño

   💻 DESKTOP (≥768px):
   - 2 columnas
   - Con flecha animada
   - Padding p-6
   - Texto normal

   ═══════════════════════════════════════════════════════════════════════════════
*/