// Página principal del catálogo
// Incluye el Hero, productos populares carrusel, categorías, historia, testimonios y llamado a la acción

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants'; // datos de testimonios
import { Testimonial, Product } from '../types';
import { useData } from '../context/DataContext'; // para obtener categorías y productos
import ProductCard from './ProductCard'; // componente reutilizable
import CategoryCard from './CategoryCard'; // componente reutilizable

// importar variantes de animación
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

// COMPONENTE TARJETA DE TESTIMONIO ANIMADA
// componente de testimonios
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
            variants={fadeInUp}
            whileHover={hoverLift}
            whileTap={tapScale}
        >
            {/* estrellas de valor*/}
            <div className="flex mb-3">{renderStars()}</div> 
            {/* testimonio */}
            <p className="text-text-secondary italic mb-4 flex-grow"> 
                "{testimonial.quote}"
            </p>
            {/* nombre */}
            <p className="font-bold text-right text-text-primary"> 
                — {testimonial.author}
            </p>
        </motion.div>
    );
};

// COMPONENTE PRINCIPAL
const HomePage: React.FC = () => {
    // ESTADOS DEL COMPONENTE
    // obtener todo desde el contexto ya cargado al inicio
    const { categories, seasonalProducts, loading: loadingCategories } = useData();

    // Estados para auto-scroll del carrusel
    const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll del carrusel
    useEffect(() => {
        if (!isAutoScrolling || !scrollContainerRef.current || seasonalProducts.length === 0) {
            return;
        }

        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const cardWidth = 288;
                const gap = 24; 
                const scrollAmount = cardWidth + gap;

                // calcular el siguiente índice
                const nextIndex = (currentScrollIndex + 1) % seasonalProducts.length;

                // si llega al final vuelve al inicio
                if (nextIndex === 0) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollTo({
                        left: nextIndex * scrollAmount,
                        behavior: 'smooth'
                    });
                }

                setCurrentScrollIndex(nextIndex);
            }
        }, 3500); // cantidad de segundos | 3.5 segundakos

        return () => clearInterval(interval);
    }, [isAutoScrolling, currentScrollIndex, seasonalProducts.length]);

    // pausa scroll cuando se hace hover
    const handleMouseEnter = () => setIsAutoScrolling(false);
    const handleMouseLeave = () => {
        // se activa de nuevo a los dos segundos
        setTimeout(() => setIsAutoScrolling(true), 2000);
    };

    // PAGINA DE INICIO COMPLETO
    return (
        <div> 
            {/* HERO */}
            <motion.section
                className="relative h-[60vh] md:h-[calc(100vh-80px)] bg-cover bg-center flex items-center overflow-hidden"
                style={{
                    backgroundImage: 'url(https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764817378/banner_sgrmq9.jpg)'
                }}
            >
                {/* Overlay oscuro*/}
                <div className="absolute inset-0 bg-black/60" />
                
                {/* Contenido*/}
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
                        href="/" 
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

            {/* PRODUCTOS DE TEMPORADA*/}
            <section id="popular-products" className="py-16 md:py-20 bg-gradient-to-b from-primary to-white/50">
                <div className="container mx-auto px-4">
                    {/* título */}
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

                {/*carrusel*/}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={viewportConfig}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="container mx-auto px-4 py-8">
                        {/* mostrar skeletons */}
                        {loadingCategories ? (
                            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={`skel-${index}`} className="w-64 md:w-72 shrink-0 snap-center">
                                        <div className="animate-pulse">
                                            <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div>
                                            <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                                            <div className="h-10 bg-gray-200 rounded-full mt-3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : seasonalProducts.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-text-secondary">
                                    No hay productos populares disponibles en este momento.
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* degradado izquierdo */}
                                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/50 to-transparent z-10 pointer-events-none hidden md:block" />

                                {/* degradao derecho */}
                                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/50 to-transparent z-10 pointer-events-none hidden md:block" />

                                {/* scroll contenedor */}
                                <div
                                    ref={scrollContainerRef}
                                    className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                                >
                                    {seasonalProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            className="w-64 md:w-72 shrink-0 snap-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* indicadores del carrusel */}
                    {!loadingCategories && seasonalProducts.length > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            {seasonalProducts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (scrollContainerRef.current) {
                                            const cardWidth = 288;
                                            const gap = 24;
                                            scrollContainerRef.current.scrollTo({
                                                left: index * (cardWidth + gap),
                                                behavior: 'smooth'
                                            });
                                            setCurrentScrollIndex(index);
                                            setIsAutoScrolling(false);
                                            setTimeout(() => setIsAutoScrolling(true), 3000);
                                        }
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentScrollIndex
                                            ? 'w-8 bg-secondary'
                                            : 'w-1.5 bg-text-secondary/30 hover:bg-text-secondary/50'
                                    }`}
                                    aria-label={`Ir al producto ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
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
                    {/* renderizado loading y Categorías */}
                    {loadingCategories ? (
                        // primero los skeleton
                        Array.from({ length: 3 }).map((_, index) => ( 
                            <motion.div 
                                key={index} 
                                className="w-full h-44 bg-gray-200 rounded-2xl animate-pulse"
                                variants={staggerItem}
                            />
                        ))
                    ) : (
                        // cuando se cargan los datos se muestran en CategoryCards
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
                    {/* terxto */}
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
                            Cada postre que creamos es un tributo a esa larga historia. Es el sabor auténtico que pasó por las manos de nuestros padres en 1999 y que hoy, con la misma dedicación y pasión, lidera Carlos Lara desde 2010. Nuestro secreto no está solo en los ingredientes de la más alta calidad, sino en la paciencia y el amor que se hornean en cada pieza, una herencia que ha endulzado generaciones de salvadoreños.
                        </p>
                        {/* página de nosotros */}
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
                    
                    {/* imagen */}
                    <motion.div 
                        className="h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl"
                        variants={fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportConfig}
                        whileHover={{ scale: 1.02 }}
                    >
                        <img 
                            src="https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764817378/banner_sgrmq9.jpg" 
                            alt="Interior de la pastelería Canela" 
                            loading="lazy" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN TESTIMONIOS */}
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
                                src="https://res.cloudinary.com/dqqdbuv3h/image/upload/v1764814507/pastel-melocoton-fresas_lvyjak.jpg" 
                                alt="Postres deliciosos" 
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* texto y boton */}
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