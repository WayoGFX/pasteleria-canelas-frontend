import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

// Importar variantes de animación
import { viewportConfig } from '../utils/animations';

// VARIANTES DE ANIMACIÓN
const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.15,
      duration: 0.5
    }
  })
};

const linkVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3
    }
  })
};

const socialIconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.5 + index * 0.1,
      type: "spring",
      stiffness: 300
    }
  })
};

const Footer: React.FC = () => {
  const { categories } = useData();
  
  // Array de redes sociales para mapear
  const socialMedia = [
    {
      name: "Instagram",
      href: "#",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    },
    {
      name: "Facebook",
      href: "#",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    }
  ];

  // Array de links de navegación 
  const navLinks = [
    { to: '/', label: 'Inicio' },
    ...categories.map(cat => ({
      to: `/category/${cat.slug}`,
      label: cat.name,
      key: cat.slug
    })),
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' }
  ];

  return (
    <footer className="bg-secondary text-primary">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Columna 1 Marca y Redes Sociales */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <motion.h3 
              className="font-serif-display text-3xl font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Canela
            </motion.h3>
            
            <motion.p 
              className="mt-2 text-sm text-primary/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
              transition={{ delay: 0.2 }}
            >
              Dulces momentos, un bocado a la vez.
            </motion.p>
            
            <div className="flex justify-center md:justify-start gap-5 mt-6">
              {socialMedia.map((social, index) => (
                <motion.a 
                  key={social.name}
                  href={social.href} 
                  aria-label={social.name} 
                  className="text-primary/80 hover:text-white transition-colors"
                  custom={index}
                  variants={socialIconVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 5
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Columna 2 de Navegación */}
          <motion.div
            custom={1}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h4 className="font-bold tracking-wider uppercase text-primary/90">
              Navegación
            </h4>
            
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link, index) => (
                <motion.li 
                  key={link.key || link.to}
                  custom={index}
                  variants={linkVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                >
                  <Link 
                    to={link.to} 
                    className="text-primary/80 hover:text-white transition-colors inline-block"
                  >
                    <motion.span
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 3 de Contacto y Horarios */}
          <motion.div
            custom={2}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h4 className="font-bold tracking-wider uppercase text-primary/90">
              Contacto
            </h4>
            
            <motion.div 
              className="mt-4 space-y-2 text-sm text-primary/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
              transition={{ delay: 0.4 }}
            >
              <motion.p
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                Av. Siempreviva 742, Springfield
              </motion.p>
              
              <motion.p whileHover={{ x: 2 }}>
                <a 
                  href="tel:+50373264065" 
                  className="hover:text-white transition-colors"
                >
                  (503) 7326-4065
                </a>
              </motion.p>
              
              <motion.p 
                className="pt-2 font-medium"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                Lunes a Domingo: 7am - 6pm
              </motion.p>
            </motion.div>
          </motion.div>

        </div>

        {/* Copyright */}
        <motion.div 
          className="mt-12 border-t border-primary/20 pt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-xs text-primary/60">
            © 2024 Canela. Todos los derechos reservados.
          </p>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;