import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

// VARIANTES DE ANIMACIÓN PARA FRAMER MOTION
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
  // obtiene funciones y estado del carrito
  const { toggleCart, cartCount, isCartAnimating } = useCart();
  
  // obtiene las categorías desde el Context para generar los links dinámicamente
  const { categories } = useData();
  
  // estado para controlar si el menú móvil está abierto
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // estado para detectar si el usuario ha hecho scroll cambia el estilo del header
  const [isScrolled, setIsScrolled] = useState(false);

  //  estado para controlar si el header debe estar visible
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // detecta dirección del scroll para mostrar/ocultar header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si el top es menos de 10 muestra el header
      if (currentScrollY < 10) {
        setIsScrolled(false);
        setIsVisible(true);
      } else {
        setIsScrolled(true);
        
        // scroll que oculta el header
        // scroll arriba lo muestra
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false); // Scrolling down
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true); // Scrolling up
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    // passive: true  mejora el performance del scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]); // se ejecuta cada vez que cambia lastScrollY

  // componente reutilizable para los links de navegación
  // se usa tanto en desktop y en el menú móvil
  const NavLinks: React.FC<{ onLinkClick?: () => void; isMobile?: boolean }> = ({ onLinkClick, isMobile = false }) => {
    // Array de links estáticos
    const staticLinks = [
      { to: '/', label: 'Inicio', end: true },
      { to: '/nosotros', label: 'Nosotros' },
      { to: '/contacto', label: 'Contacto' },
      { to: '/admin', label: 'Admin' }
    ];

    // combina categorías con links estáticos
    const allLinks = [
      staticLinks[0], // Inicio
      ...categories.map(category => ({
        to: `/category/${category.slug}`,
        label: category.name,
        key: category.slug
      })),
      ...staticLinks.slice(1) // nosotros, Contacto, Admin | los demás
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
              onClick={onLinkClick} // cierra el menú móvil al hacer clic
              end={link.end} // end hace que solo se active en la ruta exacta "/"
              className={({isActive}) => 
                `hover:text-text-primary transition-all duration-200 ease-in-out hover:-translate-y-px whitespace-nowrap ${
                  isActive ? 'text-text-primary font-bold' : '' // si está activo, se pone negrita
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
      {/* HEADER CON AUTO-HIDE Y RESPONSIVE */}
      {/* Header sticky con animación de entrada/salida por scroll */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled ? 'bg-primary shadow-md' : 'bg-primary' // agrega sombra al scrollear
        }`}
        // aanimación de mostrar/ocultar según scroll
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-3 py-3 md:px-4 md:py-4 lg:px-6">
          
          {/* Sección botón menú móvil y logo */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* botón hamburguesa */}
            <motion.button 
              onClick={() => setIsMenuOpen(true)} 
              className="lg:hidden text-text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Abrir menú"
            >
                <span className="material-symbols-outlined text-2xl md:text-3xl">menu</span>
            </motion.button>
            
            {/* nombre */}
            <motion.h1 
              className="font-serif-display text-xl md:text-2xl lg:text-3xl font-bold text-text-primary"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/">Canelas</Link>
            </motion.h1>
          </div>
          
          {/* NAVEGACIÓN DESKTOP */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-4 text-text-secondary text-sm xl:text-base flex-wrap justify-center flex-1 mx-4">
            <NavLinks />
          </nav>
          
          {/* botón del carrito */}
          <div className="flex-shrink-0">
            <motion.button 
              onClick={toggleCart} 
              className="relative text-text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Abrir carrito de compras"
            >
              {/* icono del carrito */}
              <motion.span 
                className={`material-symbols-outlined text-2xl md:text-3xl ${
                  isCartAnimating ? 'animate-jiggle' : '' // Animación
                }`}
                animate={isCartAnimating ? {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                shopping_cart
              </motion.span>
              
              {/* badge con el número de productos */}
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
        </div>
      </motion.header>
      
      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
              {/* Capa oscura de fondo */}
              <motion.div 
                className="absolute inset-0 bg-black/50"
                variants={menuOverlayVariants}
                onClick={() => setIsMenuOpen(false)} // Cierra al hacer clic afuera
              />
              
              {/* menú panel */}
              <motion.div 
                className="relative z-10 h-full w-72 sm:w-80 bg-primary shadow-2xl overflow-y-auto"
                variants={menuSidebarVariants}
              >
                  {/* header menú móvil */}
                  <motion.div 
                    className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-primary z-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                      <h2 className="font-serif-display text-xl font-bold text-text-primary">Menú</h2>
                      
                      {/* botón para cerrar */}
                      <motion.button 
                        onClick={() => setIsMenuOpen(false)} 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Cerrar menú"
                      >
                          <span className="material-symbols-outlined text-text-primary">close</span>
                      </motion.button>
                  </motion.div>
                  
                  {/* links de navegación en columna */}
                  <nav className="flex flex-col space-y-4 p-4 text-text-secondary text-lg">
                      {/* es el mismo componente */}
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