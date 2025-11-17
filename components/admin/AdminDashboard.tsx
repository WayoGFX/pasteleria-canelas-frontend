import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// variantes de animacion de tarjetas
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

// Componente principal
const AdminDashboard: React.FC = () => {
    return (
        <div className="animate-fadeIn max-w-4xl">
            
            {/* Header con título */}
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
            {/* Grid de tarjetas | 1 col móvil 2 cols desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Gestionar categorías */}
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
                            
                            {/* Flecha */}
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
                {/* Gestionar productos */}
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
                            
                            {/* Flecha*/}
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
            {/* Tips*/}
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