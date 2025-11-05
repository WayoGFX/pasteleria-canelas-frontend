import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

// ===== VARIANTES DE ANIMACIÓN PARA FRAMER MOTION =====
const menuOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const menuSidebarVariants = {
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

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3
    }
  })
};

const cartBadgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const Header: React.FC = () => {
  // Obtiene funciones y estado del carrito
  const { toggleCart, cartCount, isCartAnimating } = useCart();
  
  // Obtiene las categorías desde el Context (para generar los links dinámicamente)
  const { categories } = useData();
  
  // Estado para controlar si el menú móvil está abierto
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estado para detectar si el usuario ha hecho scroll (cambia el estilo del header)
  const [isScrolled, setIsScrolled] = useState(false);

  // Detecta el scroll para agregar sombra al header cuando no estás arriba del todo
  useEffect(() => {
    const handleScroll = () => {
      // Si has scrolleado más de 10px, activa el estado
      setIsScrolled(window.scrollY > 10);
    };

    // { passive: true } mejora el performance del scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  // Componente reutilizable para los links de navegación
  // Se usa tanto en desktop como en el menú móvil
  const NavLinks: React.FC<{ onLinkClick?: () => void; isMobile?: boolean }> = ({ onLinkClick, isMobile = false }) => {
    // Array de links estáticos
    const staticLinks = [
      { to: '/', label: 'Inicio', end: true },
      { to: '/nosotros', label: 'Nosotros' },
      { to: '/contacto', label: 'Contacto' },
      { to: '/admin', label: 'Admin' }
    ];

    // Combina categorías con links estáticos
    const allLinks = [
      staticLinks[0], // Inicio
      ...categories.map(category => ({
        to: `/category/${category.slug}`,
        label: category.name,
        key: category.slug
      })),
      ...staticLinks.slice(1) // Nosotros, Contacto, Admin
    ];

    return (
      <>
        {allLinks.map((link, index) => (
          <motion.div
            key={link.key || link.to}
            custom={isMobile ? index : 0}
            variants={isMobile ? menuItemVariants : undefined}
            initial={isMobile ? "hidden" : undefined}
            animate={isMobile ? "visible" : undefined}
          >
            <NavLink 
              onClick={onLinkClick} // Cierra el menú móvil al hacer clic
              end={link.end} // "end" hace que solo se active en la ruta exacta "/"
              className={({isActive}) => 
                `hover:text-text-primary transition-all duration-200 ease-in-out hover:-translate-y-px ${
                  isActive ? 'text-text-primary font-bold' : '' // Si está activo, se pone negrita
                }`
              } 
              to={link.to}
            >
              {link.label}
            </NavLink>
          </motion.div>
        ))}
      </>
    );
  };

  return (
    <>
      {/* Header sticky (se queda fijo en la parte superior al hacer scroll) */}
      <motion.header 
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled ? 'bg-primary shadow-md' : 'bg-primary' // Agrega sombra al scrollear
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto flex items-center p-4 justify-between">
          
          {/* Sección izquierda: botón menú móvil + logo */}
          <div className="flex items-center gap-4">
            {/* Botón hamburguesa (solo visible en móvil) */}
            <motion.button 
              onClick={() => setIsMenuOpen(true)} 
              className="md:hidden text-text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <span className="material-symbols-outlined text-3xl">menu</span>
            </motion.button>
            
            {/* Logo/nombre de la tienda */}
            <motion.h1 
              className="font-serif-display text-2xl md:text-3xl font-bold text-text-primary"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/">Canelas</Link>
            </motion.h1>
          </div>
          
          {/* Navegación desktop (oculta en móvil con "hidden md:flex") */}
          <nav className="hidden md:flex space-x-6 text-text-secondary items-center">
            <NavLinks />
          </nav>
          
          {/* Botón del carrito (siempre visible) */}
          <motion.button 
            onClick={toggleCart} 
            className="relative text-text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Ícono del carrito con animación cuando se agrega algo */}
            <motion.span 
              className={`material-symbols-outlined text-3xl ${
                isCartAnimating ? 'animate-jiggle' : '' // Animación de "sacudida"
              }`}
              animate={isCartAnimating ? {
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              shopping_cart
            </motion.span>
            
            {/* Badge con el número de productos (solo si hay productos) */}
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white ring-2 ring-primary"
                  variants={cartBadgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={cartCount}
                >
                  <motion.span
                    key={`count-${cartCount}`}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {cartCount}
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>
      
      {/* ===== MENÚ MÓVIL (SIDEBAR LATERAL) ===== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
              {/* Capa oscura de fondo (overlay) */}
              <motion.div 
                className="absolute inset-0 bg-black/50"
                variants={menuOverlayVariants}
                onClick={() => setIsMenuOpen(false)} // Cierra al hacer clic afuera
              />
              
              {/* Panel lateral del menú */}
              <motion.div 
                className="relative z-10 h-full w-64 bg-primary shadow-2xl"
                variants={menuSidebarVariants}
              >
                  {/* Header del menú móvil */}
                  <motion.div 
                    className="flex items-center justify-between p-4 border-b border-gray-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                      <h2 className="font-serif-display text-xl font-bold">Menú</h2>
                      
                      {/* Botón X para cerrar */}
                      <motion.button 
                        onClick={() => setIsMenuOpen(false)} 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                          <span className="material-symbols-outlined">close</span>
                      </motion.button>
                  </motion.div>
                  
                  {/* Links de navegación en columna */}
                  <nav className="flex flex-col space-y-4 p-4 text-text-secondary text-lg">
                      {/* Reutiliza el mismo componente NavLinks, pero cierra el menú al hacer clic */}
                      <NavLinks onLinkClick={() => setIsMenuOpen(false)} isMobile={true} />
                  </nav>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

/* ===== MEJORAS IMPLEMENTADAS CON FRAMER MOTION =====

✅ HEADER:
- Slide down al cargar la página (y: -100 → 0)
- Mantiene el scroll detection para sombra

✅ BOTÓN HAMBURGUESA:
- Hover: scale 1.05
- Tap: scale 0.95

✅ LOGO:
- Hover: scale 1.02 (sutil)

✅ CARRITO:
- Hover: scale 1.05
- Tap: scale 0.95
- Animación mejorada cuando se agrega producto (jiggle + rotate + scale)

✅ BADGE DEL CARRITO:
- AnimatePresence para entrada/salida
- Aparece con spring animation
- Número interno con bounce al cambiar
- Desaparece suavemente

✅ MENÚ MÓVIL:
- Overlay con fade in/out
- Sidebar con spring desde la izquierda
- Header del menú con fade + slide
- Links con stagger animation (aparecen uno por uno)
- Botón cerrar rota 90° en hover

✅ MANTIENE:
- Todos los comentarios originales
- Lógica de navegación
- Estructura del código
- Links dinámicos de categorías
- Scroll detection

===== ANIMACIONES ESPECÍFICAS =====

1. CARRITO ANIMADO:
   - Cuando isCartAnimating = true
   - Rota: -10° → 10° → -10° → 10° → 0°
   - Scale: 1 → 1.1 → 1
   - Duración: 0.5s

2. BADGE CON SPRING:
   - Aparece con "pop" (spring)
   - Número cambia con scale 1.5 → 1
   - Desaparece con fade out

3. MENÚ MÓVIL:
   - Overlay: fade 0 → 1
   - Sidebar: slide -100% → 0 con spring
   - Items: stagger con delay 0.05s cada uno

*/