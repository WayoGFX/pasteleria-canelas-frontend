// Página principal del catálogo público de la pastelería.
// Incluye: Hero, productos populares (carrusel), categorías,
// historia, testimonios y llamado a la acción.
// Es el componente público más completo y complejo.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { TESTIMONIALS } from '../constants'; // Datos de testimonios (datos estáticos)
import { Testimonial, Product } from '../types';
import { useData } from '../context/DataContext'; // Para obtener categorías y productos
// ⚠️ YA NO SE IMPORTA fetchSeasonalProducts
import ProductCard from './ProductCard'; // Componente reutilizable
import CategoryCard from './CategoryCard'; // Componente reutilizable

// Importar variantes de animación
import {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer,
    staggerItem,
    heroTitle,
    heroSubtitle,
    heroCTA,
    hoverLift,
    tapScale,
    viewportConfig,
    scaleUp
} from '../utils/animations';

// ===== COMPONENTE: TARJETA DE TESTIMONIO ANIMADA =====
// Componente de testimonios
// es reutilizable
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    
    const renderStars = () => {
        // se renderizan según preferencias del 1 al 5
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <motion.span 
                    key={i} 
                    className={`material-symbols-outlined text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    // Animación de aparición individual
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                >
                    star
                </motion.span>
            );
        }
        return stars;
    };

    return (
        <motion.div 
            className="bg-card-bg p-6 rounded-2xl shadow-lg flex flex-col h-full"
            variants={fadeInUp} // Animación de entrada al aparecer en la vista
            whileHover={hoverLift} // Micro-interaction de elevación al hacer hover
            whileTap={tapScale}
        >
            {/* Estrellas de valor*/}
            <div className="flex mb-3">{renderStars()}</div> 
            {/* Testimonio */}
            <p className="text-text-secondary italic mb-4 flex-grow"> 
                "{testimonial.quote}"
            </p>
            {/* Nombre */}
            <p className="font-bold text-right text-text-primary"> 
                — {testimonial.author}
            </p>
        </motion.div>
    );
};

// COMPONENTE PRINCIPAL
const HomePage: React.FC = () => {
    // ESTADOS DEL COMPONENTE
    // ⚠️ YA NO se carga productos de temporada con useState
    // ⚠️ YA NO hay loadingPopular
    
    // ⚡ NUEVO: Obtener todo desde el contexto (ya cargado al inicio)
    const { categories, seasonalProducts, loading: loadingCategories } = useData();

    // REFS Y ESTADOS PARA EL CARRUSEL AUTOMÁTICO
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [direction, setDirection] = useState(0); // 1 = derecha, -1 = izquierda
    const autoPlayInterval = useRef<NodeJS.Timeout | null>(null);

    // PARALLAX LIMITADO (SOLO HERO)
    // useRef es para permitir acceso al dom
    const heroRef = useRef<HTMLDivElement>(null);
    
    // useScroll y useTransform para el efecto Parallax
    const { scrollY } = useScroll({ 
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    // Parallax scrolling en hero (mueve la imagen de fondo)
    const heroY = useTransform(scrollY, [0, 500], [0, 150]); 
    // Opacidad para oscurecer el overlay al hacer scroll
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]); 


    // AUTO-PLAY DEL CARRUSEL
    // Usa seasonalProducts en lugar de popularProducts
    useEffect(() => {
        // Solo auto-play si hay productos y está activado
        if (isAutoPlaying && seasonalProducts.length > 0) {
            autoPlayInterval.current = setInterval(() => {
                setDirection(1); // Dirección derecha
                setCurrentIndex((prevIndex) => 
                    prevIndex + 1 >= seasonalProducts.length ? 0 : prevIndex + 1
                );
            }, 4000); // Cada 4 segundos

            return () => {
                if (autoPlayInterval.current) {
                    clearInterval(autoPlayInterval.current);
                }
            };
        }
    }, [isAutoPlaying, seasonalProducts.length]);

    // FUNCIONES DE NAVEGACIÓN
    // ⚡ ACTUALIZADO: Usa seasonalProducts en lugar de popularProducts
    const goToNext = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => 
            prevIndex + 1 >= seasonalProducts.length ? 0 : prevIndex + 1
        );
        // Reinicia el auto-play
        pauseAutoPlay();
        resumeAutoPlay();
    };

    const goToPrev = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => 
            prevIndex - 1 < 0 ? seasonalProducts.length - 1 : prevIndex - 1
        );
        // Reinicia el auto-play
        pauseAutoPlay();
        resumeAutoPlay();
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
        pauseAutoPlay();
        resumeAutoPlay();
    };

    const pauseAutoPlay = () => {
        setIsAutoPlaying(false);
        if (autoPlayInterval.current) {
            clearInterval(autoPlayInterval.current);
        }
    };

    const resumeAutoPlay = () => {
        setTimeout(() => setIsAutoPlaying(true), 1000); // Resume después de 1 segundo
    };

    // OBTENER PRODUCTOS VISIBLES
    // Desktop: 4 productos | Móvil: 1 producto
    // ⚡ ACTUALIZADO: Usa seasonalProducts en lugar de popularProducts
    const getVisibleProducts = (isMobile: boolean) => {
        if (seasonalProducts.length === 0) return [];
        
        const itemsToShow = isMobile ? 1 : 4;
        const visibleProducts = [];
        
        for (let i = 0; i < itemsToShow; i++) {
            const index = (currentIndex + i) % seasonalProducts.length;
            visibleProducts.push(seasonalProducts[index]);
        }
        
        return visibleProducts;
    };

    // VARIANTES DE ANIMACIÓN PARA EL CARRUSEL
    const carouselVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0
        })
    };

    // FUNCIÓN: RENDERIZAR LISTA DE PRODUCTOS CON ESTADOS
    // renderiza la lista según estado
    // ⚡ ACTUALIZADO: Usa loadingCategories y seasonalProducts
    const renderCarousel = () => {
        // Mostrar skeletons mientras carga el catálogo completo
        if (loadingCategories) {
            // Array.from({ length: 4 }) crea array de 4 elementos undefined
            // Se mapea para crear 4 skeletons
            return (
                <div className="flex gap-6 justify-center">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`skel-${index}`} className="w-64 md:w-72 shrink-0 hidden md:block">
                            <div className="animate-pulse">
                                {/* imagen cuadrada */}
                                <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div> 
                                {/* título */}
                                <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div> 
                                {/* subtítulo */}
                                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div> 
                                {/* botón*/}
                                <div className="h-10 bg-gray-200 rounded-full mt-3"></div> 
                            </div>
                        </div>
                    ))}
                    {/* Skeleton móvil */}
                    <div className="w-64 md:hidden">
                        <div className="animate-pulse">
                            <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div>
                            <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                            <div className="h-10 bg-gray-200 rounded-full mt-3"></div>
                        </div>
                    </div>
                </div>
            );
        }

        // Si no hay productos de temporada entonces se muestra mensaje
        if (seasonalProducts.length === 0) {
            return (
                <div className="text-center py-10">
                    <p className="text-text-secondary">
                        No hay productos populares disponibles en este momento.
                    </p>
                </div>
            );
        }

        // Mostrar tarjetas de producto
        return (
            <>
                {/* DESKTOP: 4 productos visibles */}
                <div className="hidden md:flex gap-6 justify-center overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={carouselVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            className="flex gap-6"
                        >
                            {getVisibleProducts(false).map((product) => (
                                <div key={product.id} className="w-64 md:w-72 shrink-0">
                                    {/* ProductCard es un componente*/}
                                    <ProductCard product={product} /> 
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* MÓVIL: 1 producto visible */}
                <div className="md:hidden flex justify-center overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={carouselVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            className="w-64"
                        >
                            {getVisibleProducts(true).map((product) => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </>
        );
    };

    // RENDER DEL HOMEPAGE COMPLETO
    return (
        <div> 
            {/* HERO del banner */}
            <motion.section 
                ref={heroRef}
                className="relative h-[60vh] md:h-[calc(100vh-80px)] bg-cover bg-center flex items-center overflow-hidden" 
                style={{ 
                    backgroundImage: 'url(https://picsum.photos/seed/hero-background/1920/1080)' 
                }}
            >
                {/* Imagen de fondo con Parallax */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: 'url(https://picsum.photos/seed/hero-background/1920/1080)',
                        y: heroY
                    }}
                />
                
                {/* Overlay oscuro semitransparente para la imagen */}
                <motion.div 
                    className="absolute inset-0 bg-black/40"
                    style={{ opacity: heroOpacity }}
                />
                
                {/* Contenido del hero */}
                <div className="relative container mx-auto px-4 text-center text-white z-10">
                    <motion.h1 
                        className="font-serif-display text-6xl md:text-8xl font-bold"
                        variants={heroTitle}
                        initial="hidden"
                        animate="visible"
                    >
                        Arte en cada bocado
                    </motion.h1>
                    
                    <motion.p 
                        className="mt-4 text-xl md:text-2xl max-w-2xl mx-auto"
                        variants={heroSubtitle}
                        initial="hidden"
                        animate="visible"
                    >
                        Hecho a mano, con amor y los mejores ingredientes. 
                        Descubre el sabor de la verdadera pastelería artesanal.
                    </motion.p>
                    
                    <motion.a 
                        href="#categories" 
                        className="mt-8 inline-block bg-white text-text-primary font-bold py-3 px-8 rounded-lg text-lg shadow-md"
                        variants={heroCTA}
                        initial="hidden"
                        animate="visible"
                        // Micro-interactions en hover
                        whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }} 
                        whileTap={{ scale: 0.95 }}
                    >
                        Explorar menú
                    </motion.a>
                </div>
            </motion.section>

            {/* PRODUCTOS POPULARES DE TEMPORADA*/}
            <section id="popular-products" className="py-16 md:py-20 bg-gradient-to-b from-primary to-white/50">
                <div className="container mx-auto px-4">
                    {/* Título */}
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportConfig}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.span 
                            className="inline-block px-4 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-3"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={viewportConfig}
                            transition={{ delay: 0.2 }}
                        >
                            Temporada
                        </motion.span>
                        
                        <h2 className="font-serif-display text-4xl md:text-5xl font-bold text-text-primary mb-2">
                            Lo más popular
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Descubre nuestras creaciones favoritas de la temporada
                        </p>
                    </motion.div>
                </div>
                
                {/* Contenedor del carrusel con botones de navegación */}
                <motion.div 
                    className="relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={viewportConfig}
                    // Pausa y reanuda el auto-play al interactuar
                    onMouseEnter={pauseAutoPlay} 
                    onMouseLeave={resumeAutoPlay}
                >
                    <div className="container mx-auto px-4 relative py-8">
                        {renderCarousel()}
                    </div>
                    
                    {/* Botones de navegación */}
                    {/* ⚡ ACTUALIZADO: Usa loadingCategories y seasonalProducts */}
                    {!loadingCategories && seasonalProducts.length > 0 && (
                        <>
                            <motion.button
                                onClick={goToPrev}
                                aria-label="Anterior"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                                whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="material-symbols-outlined text-2xl text-text-primary">
                                    arrow_back
                                </span>
                            </motion.button>
                            
                            <motion.button
                                onClick={goToNext}
                                aria-label="Siguiente"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                                whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="material-symbols-outlined text-2xl text-text-primary">
                                    arrow_forward
                                </span>
                            </motion.button>
                        </>
                    )}
                    
                    {/* Indicadores (puntos) */}
                    {/* ⚡ ACTUALIZADO: Usa loadingCategories y seasonalProducts */}
                    {!loadingCategories && seasonalProducts.length > 0 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {seasonalProducts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Ir al producto ${index + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentIndex 
                                            ? 'w-8 bg-secondary' 
                                            : 'w-2 bg-text-secondary/30 hover:bg-text-secondary/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Indicador de auto-play */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">
                                {isAutoPlaying ? 'pause' : 'play_arrow'}
                            </span>
                            <span>{isAutoPlaying ? 'Pausar' : 'Reanudar'}</span>
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* CATEGORÍAS */}
            <section id="categories" className="container mx-auto px-4 py-16 md:py-20">
                <motion.h2 
                    className="font-serif-display text-4xl md:text-5xl font-bold pb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                >
                    Explora por categorías
                </motion.h2>
                
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    {/* Renderizado Loading y Categorías */}
                    {loadingCategories ? (
                        // Primero se muestra los skeleton
                        // Array.from({ length: 3 }) crea array de 3 elementos undefined
                        Array.from({ length: 3 }).map((_, index) => ( 
                            <motion.div 
                                key={index} 
                                className="w-full h-44 bg-gray-200 rounded-2xl animate-pulse"
                                variants={staggerItem}
                            />
                        ))
                    ) : (
                        // Cuando se cargan los datos se muestran en CategoryCards
                        categories.map((category) => ( 
                            <motion.div 
                                key={category.slug}
                                variants={staggerItem}
                            >
                                <CategoryCard category={category} />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </section>
            
            {/* SECCIÓN DE NOSOTROS*/}
            <section id="nosotros" className="container mx-auto px-4 py-16 md:py-20 bg-white/50 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Textos */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        <h2 className="font-serif-display text-4xl md:text-5xl font-bold mb-6">
                            Nuestra Historia
                        </h2>
                        <p className="text-text-secondary text-lg mb-6 leading-relaxed">
                            En Canela, cada receta cuenta una historia de tradición y amor por la repostería. 
                            Nacimos de un sueño familiar: compartir la alegría a través de postres que evocan 
                            calidez y hogar. Utilizamos solo los ingredientes más frescos y de la más alta 
                            calidad para crear sabores que perduran en la memoria.
                        </p>
                        {/* Link a la página completa de nosotros */}
                        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}> 
                            <Link 
                                to="/nosotros" 
                                className="inline-flex items-center gap-2 text-secondary font-bold text-lg group"
                            >
                                <span>Conoce más sobre nosotros</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </Link>
                        </motion.div>
                    </motion.div>
                    
                    {/* Columna de imagen */}
                    <motion.div 
                        className="h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
                        variants={fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        whileHover={{ scale: 1.02 }}
                    >
                        <img 
                            src="https://picsum.photos/seed/bakery/600/400" 
                            alt="Interior de la pastelería Canela" 
                            loading="lazy" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN DE TESTIMONIOS */}
            <section id="testimonials" className="py-16 md:py-20 bg-accent/10">
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="font-serif-display text-4xl md:text-5xl font-bold pb-4 text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportConfig}
                    >
                        Lo que dicen nuestros clientes
                    </motion.h2>
                    
                    {/* Grid de 3 columnas*/}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                    >
                        {TESTIMONIALS.map((testimonial, index) => (
                            <motion.div 
                                key={index}
                                variants={staggerItem}
                            >
                                <TestimonialCard testimonial={testimonial} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN DE ACCIÓN FINAL*/}
            <section id="contacto" className="container mx-auto px-4 py-16 md:py-20">
                <motion.div 
                    className="relative rounded-3xl overflow-hidden shadow-2xl bg-card-bg"
                    variants={scaleUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportConfig}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Columna de la imagen */}
                        <div className="relative h-80 lg:h-full min-h-[320px] order-1 lg:order-2">
                            <img 
                                src="https://picsum.photos/seed/contact-cta/800/600" 
                                alt="Postres deliciosos" 
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Texto y boton */}
                        <div className="p-10 md:p-16 flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left items-center lg:items-start">
                            <h3 className="font-serif-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
                                ¿Listo para endulzar tu día?
                            </h3>
                            <p className="mt-2 text-text-secondary text-lg max-w-md mb-8">
                                Contáctanos para realizar tu pedido o visítanos. Estaremos encantados 
                                de atenderte y ayudarte a elegir el postre perfecto.
                            </p>
                            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/contacto" 
                                    className="inline-flex items-center gap-2 bg-secondary text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <span>Ir a Contacto</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default HomePage;

/* ===== OPTIMIZACIONES IMPLEMENTADAS =====

✅ ELIMINADO:
1. import fetchSeasonalProducts
2. useState para popularProducts
3. useState para loadingPopular
4. useEffect completo que cargaba productos

✅ AGREGADO:
1. seasonalProducts desde useData()
2. Uso de loadingCategories para todos los skeletons

✅ ACTUALIZADO:
1. Todas las referencias popularProducts → seasonalProducts
2. Todas las referencias loadingPopular → loadingCategories
3. useEffect de auto-play ahora usa seasonalProducts.length
4. Funciones goToNext/goToPrev usan seasonalProducts.length
5. getVisibleProducts usa seasonalProducts
6. renderCarousel usa loadingCategories y seasonalProducts
7. Botones de navegación usan loadingCategories y seasonalProducts
8. Indicadores de puntos usan seasonalProducts

✅ RESULTADO:
- HomePage ya NO hace peticiones HTTP
- Los productos de temporada vienen pre-cargados
- Carrusel funciona instantáneamente
- Sin delays ni loading adicional

*/