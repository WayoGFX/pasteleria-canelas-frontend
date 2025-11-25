import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { WHATSAPP_NUMBER } from '../constants';

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
      name: "WhatsApp",
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    },
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
                  key={link.to}
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