import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';


// VARIANTES DE ANIMACIÓN
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { 
        x: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    exit: { 
        x: '-100%',
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    }
};


// COMPONENTE PRINCIPAL
const AdminLayout: React.FC = () => {
    const { logout } = useAuth();

    // Estado | Controla si el menú móvil está abierto
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    // Clases dinámicas para los navLinks
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
            isActive 
            ? 'bg-secondary/10 text-secondary' 
            : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
        }`;

    // Contenido del Sidebar
    const SidebarContent: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => (
        <>
            <div>
                <div className="font-serif-display text-2xl font-bold text-text-primary mb-8">
                    Admin Panel
                </div>
                
                {/* Navegación */}
                <nav className="space-y-2">
                    <NavLink 
                        to="/admin" 
                        end 
                        className={navLinkClasses}
                        onClick={onLinkClick} // Cierra el menú en móvil
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Dashboard</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/categories" 
                        className={navLinkClasses}
                        onClick={onLinkClick}
                    >
                        <span className="material-symbols-outlined">category</span>
                        <span>Categorías</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/products" 
                        className={navLinkClasses}
                        onClick={onLinkClick}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span>Productos</span>
                    </NavLink>
                </nav>
            <div className="mt-auto">
                <button 
                    onClick={() => {
                        logout();
                        onLinkClick?.(); // Cierra el menú si está en móvil
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-700"
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
            </div>
            
            {/* Botón de cerrar sesión*/}

        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* sidebar para compu */}
            <aside className="hidden lg:flex w-64 flex-shrink-0 bg-primary border-r border-gray-200 p-4 flex-col">
                <SidebarContent />
            </aside>
            {/* Contenido */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADERcon hamburguesa */}
                <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
                    {/* Botón hamburguesa */}
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 rounded-md text-text-primary hover:bg-gray-100"
                        whileTap={{ scale: 0.95 }}
                        aria-label="Abrir menú"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </motion.button>
                    <h1 className="font-serif-display text-xl font-bold text-text-primary">
                        Admin Panel
                    </h1>
                </header>
                
                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
            {/* SIDEBAR MÓVIL */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        className="fixed inset-0 z-50 lg:hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >

                        <motion.div 
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            variants={overlayVariants}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        {/* panel lateral */}
                        <motion.aside 
                            className="relative z-10 h-full w-72 sm:w-80 bg-primary shadow-2xl p-4 flex flex-col"
                            variants={sidebarVariants}
                        >
                            {/* nbotón cerrar */}
                            <div className="flex justify-end mb-4">
                                <motion.button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Cerrar menú"
                                >
                                    <span className="material-symbols-outlined text-text-primary">close</span>
                                </motion.button>
                            </div>
                            
                            {/* Contenido del sidebar0*/}
                            <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLayout;