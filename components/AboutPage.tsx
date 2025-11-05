import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';

// Importar variantes de animación
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  viewportConfig,
  scaleUp
} from '../utils/animations';

// ===== VARIANTES ADICIONALES PARA ABOUT PAGE =====
const pillarCardVariants = {
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

const galleryImageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 200
    }
  })
};

const AboutPage: React.FC = () => {
    const crumbs = [
        { label: 'Inicio', link: '/' },
        { label: 'Nosotros' }
    ];

    // Datos de los pilares
    const pillars = [
        {
            icon: "workspace_premium",
            title: "Calidad Suprema",
            description: "Seleccionamos solo los mejores ingredientes, frescos y de origen local siempre que es posible, para garantizar un sabor inigualable."
        },
        {
            icon: "auto_stories",
            title: "Tradición Artesanal",
            description: "Honramos las recetas que han pasado de generación en generación, aplicando técnicas artesanales que resaltan el sabor auténtico."
        },
        {
            icon: "favorite",
            title: "Pasión en Cada Detalle",
            description: "Cada pastel, galleta y postre es una obra de arte creada con dedicación, amor y una pizca de magia para tu disfrute."
        }
    ];

    // Datos de la galería
    const galleryImages = [
        { src: "https://picsum.photos/seed/baking-process/500/500", alt: "Manos amasando" },
        { src: "https://picsum.photos/seed/flour-hands/500/500", alt: "Ingredientes frescos" },
        { src: "https://picsum.photos/seed/cake-decoration/500/500", alt: "Decorando un pastel" },
        { src: "https://picsum.photos/seed/fresh-ingredients/500/500", alt: "Pastel terminado" }
    ];

    return (
        <motion.div 
            className="bg-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container mx-auto px-4 py-6 md:py-12 relative">
                <Breadcrumbs crumbs={crumbs} />
                
                <div className="space-y-16 pt-8">
                    {/* ===== HERO SECTION ===== */}
                    <motion.div 
                        className="text-center max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-serif-display text-4xl md:text-5xl font-bold">
                            Conoce el Corazón de Canela
                        </h2>
                        <motion.p 
                            className="mt-4 text-lg text-text-secondary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            Más que una pastelería, somos una familia apasionada por crear momentos dulces e inolvidables. Descubre nuestra historia y los valores que horneamos en cada creación.
                        </motion.p>
                    </motion.div>

                    {/* ===== FOUNDER STORY SECTION ===== */}
                    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                        {/* Imagen de la fundadora */}
                        <motion.div 
                            className="relative"
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportConfig}
                        >
                            <motion.div 
                                className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <img 
                                    src="https://picsum.photos/seed/founder/600/800" 
                                    alt="Fundadora de la pastelería Canela" 
                                    loading="lazy" 
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </motion.div>
                        
                        {/* Historia de la fundadora */}
                        <motion.div
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportConfig}
                        >
                            <motion.h3 
                                className="font-serif-display text-3xl font-bold mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={viewportConfig}
                                transition={{ delay: 0.2 }}
                            >
                                Desde nuestra cocina a tu corazón
                            </motion.h3>
                            
                            <div className="space-y-4 text-text-secondary text-justify">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={viewportConfig}
                                    transition={{ delay: 0.3 }}
                                >
                                    "Canela nació de un sueño y las recetas de mi abuela. Cada postre que creamos es un tributo a la tradición familiar, horneado con la misma paciencia y amor que ella me enseñó. Nuestro secreto no está solo en los ingredientes de la más alta calidad, sino en la alegría de compartir algo hecho a mano, pensado para endulzar tu día y celebrar tus momentos más especiales."
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={viewportConfig}
                                    transition={{ delay: 0.4 }}
                                >
                                    "Nuestra misión es ser parte de tus celebraciones y convertir días ordinarios en recuerdos dulces. Creemos que un buen postre tiene el poder de unir personas, crear sonrisas y confortar el alma. Por eso ponemos el corazón en cada detalle, desde la mezcla hasta la decoración final."
                                </motion.p>
                            </div>
                            
                            <motion.p 
                                className="font-serif-display text-lg text-right text-accent italic mt-4"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={viewportConfig}
                                transition={{ delay: 0.5 }}
                            >
                                - Elena V.
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* ===== PILARES SECTION ===== */}
                    <div>
                        <motion.h3 
                            className="font-serif-display text-3xl font-bold mb-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={viewportConfig}
                        >
                            Nuestros Pilares
                        </motion.h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {pillars.map((pillar, index) => (
                                <motion.div
                                    key={pillar.title}
                                    custom={index}
                                    variants={pillarCardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewportConfig}
                                >
                                    <motion.div 
                                        className="bg-white p-6 rounded-2xl shadow-lg h-full"
                                        whileHover={{ 
                                            y: -8,
                                            boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div 
                                            className="flex items-center justify-center h-16 w-16 bg-accent/20 text-secondary rounded-full mx-auto mb-4"
                                            whileHover={{ 
                                                scale: 1.1,
                                                rotate: 5
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <span className="material-symbols-outlined text-4xl">
                                                {pillar.icon}
                                            </span>
                                        </motion.div>
                                        <h4 className="font-bold text-xl mb-2">{pillar.title}</h4>
                                        <p className="text-text-secondary text-sm">{pillar.description}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ===== GALERÍA SECTION ===== */}
                    <div>
                        <motion.h3 
                            className="font-serif-display text-3xl font-bold mb-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={viewportConfig}
                        >
                            Un Vistazo a Nuestro Taller
                        </motion.h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryImages.map((image, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    variants={galleryImageVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewportConfig}
                                >
                                    <motion.div 
                                        className="aspect-square overflow-hidden rounded-2xl shadow-lg"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.img 
                                            src={image.src}
                                            alt={image.alt}
                                            loading="lazy" 
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    {/* ===== CTA FINAL ===== */}
                    <motion.div 
                        className="mt-16 md:mt-20 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="font-serif-display text-3xl font-bold">
                            ¿Inspirado por nuestra pasión?
                        </h3>
                        <motion.p 
                            className="mt-3 text-lg text-text-secondary max-w-xl mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={viewportConfig}
                            transition={{ delay: 0.2 }}
                        >
                            Ahora que conoces nuestra historia, te invitamos a explorar las delicias que creamos con tanto amor y dedicación.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={viewportConfig}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <Link 
                                to="/" 
                                className="mt-6 inline-block bg-secondary text-white font-bold py-3 px-8 rounded-lg text-sm shadow-md"
                            >
                                <motion.span
                                    whileHover={{ 
                                        y: -3,
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="block"
                                >
                                    Ver Nuestros Productos
                                </motion.span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;

/* ===== MEJORAS IMPLEMENTADAS CON FRAMER MOTION =====

✅ ELIMINADO:
- Todos los data-aos
- animate-fadeIn de Tailwind
- Dependencias de AOS

✅ HERO SECTION:
- Título con fade + slide up
- Descripción con delay

✅ FOUNDER STORY:
- Imagen con hover scale + sombra
- Texto con slide desde la izquierda
- Párrafos con delays escalonados
- Firma con slide desde la derecha

✅ PILARES:
- Cards con stagger (aparecen uno por uno)
- Hover: Se elevan 8px
- Ícono rota 5° en hover
- Transiciones suaves

✅ GALERÍA:
- Imágenes con spring animation
- Stagger con delays incrementales
- Hover: Card escala 1.05
- Imagen interna escala 1.1

✅ CTA FINAL:
- Fade + slide up
- Botón con spring
- Hover: Se eleva 3px

✅ PERFORMANCE:
- GPU-accelerated animations
- Viewport observers optimizados
- Transiciones suaves

*/