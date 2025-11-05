import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CUSTOM_CAKE_OPTIONS, WHATSAPP_NUMBER, BUSINESS_NAME } from '../constants';
import { CustomCakeSelection } from '../types';
import Breadcrumbs from './Breadcrumbs';

// ===== VARIANTES DE ANIMACIÓN PARA FRAMER MOTION =====
const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: index * 0.1,
            duration: 0.4
        }
    })
};

const optionButtonVariants = {
    unselected: { 
        scale: 1,
        borderColor: 'rgb(229, 231, 235)' // gray-200
    },
    selected: { 
        scale: 1,
        borderColor: 'var(--secondary)',
        transition: { duration: 0.2 }
    },
    hover: { 
        y: -2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
};

const visualizerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
        }
    }
};

const layerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

const summaryItemVariants = {
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

const CustomCakePage: React.FC = () => {
    // ===== INICIALIZACIÓN DEL ESTADO =====
    // useMemo se usa para calcular las selecciones iniciales solo UNA VEZ (optimización)
    // No se recalcula en cada render, solo cuando cambian las dependencias (en este caso ninguna)
    const initialSelections = useMemo(() => {
        // Recorre todas las secciones (base, relleno, cobertura, etc.)
        return CUSTOM_CAKE_OPTIONS.reduce((acc, section) => {
            // Para cada sección, selecciona automáticamente la primera opción
            // Ejemplo: si la primera sección es "base", selecciona la primera base disponible
            acc[section.id] = section.options[0]?.id || null;
            return acc;
        }, {} as CustomCakeSelection);
        // El resultado es algo como: { base: "vainilla", relleno: "chocolate", ... }
    }, []); // [] = solo se ejecuta una vez al montar el componente

    // Estado que guarda todas las selecciones del usuario
    // Ejemplo: { base: "vainilla", relleno: "fresa", cobertura: "fondant", ... }
    const [selections, setSelections] = useState<CustomCakeSelection>(initialSelections);

    // Función que actualiza una selección específica cuando el usuario hace clic en un botón
    const handleSelect = (sectionId: string, optionId: string) => {
        setSelections(prev => ({
            ...prev, // Mantiene todas las selecciones anteriores
            [sectionId]: optionId, // Actualiza solo la sección que cambió
        }));
        // Ejemplo: si cambias el relleno de "chocolate" a "fresa"
        // prev = { base: "vainilla", relleno: "chocolate", ... }
        // nuevo = { base: "vainilla", relleno: "fresa", ... }
    };

    // Genera el mensaje de WhatsApp con todas las opciones seleccionadas
    const generateWhatsAppMessage = () => {
        let message = `¡Hola ${BUSINESS_NAME}! Me gustaría cotizar un pastel personalizado con las siguientes características:\n\n`;
        
        // Recorre cada sección y agrega la opción seleccionada al mensaje
        CUSTOM_CAKE_OPTIONS.forEach(section => {
            const selectedOptionId = selections[section.id]; // ID de la opción seleccionada
            const selectedOption = section.options.find(opt => opt.id === selectedOptionId); // Busca el objeto completo
            
            if (selectedOption) {
                // Agrega línea formateada con negrita en WhatsApp (usando *)
                message += `*${section.name}:* ${selectedOption.name}\n`;
            }
        });

        message += `\n¡Quedo a la espera de la cotización, muchas gracias!`;

        // Codifica el mensaje para URL y abre WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    // Migajas de pan para navegación
    const crumbs = [
      { label: 'Inicio', link: '/' },
      { label: 'Crea tu Pastel Personalizado' }
    ];

    return (
        <motion.div 
            className="container mx-auto px-4 py-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
             <Breadcrumbs crumbs={crumbs} />
             
             {/* Encabezado de la página */}
            <motion.div 
                className="mb-6 lg:mb-10 text-center pt-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h2 className="font-serif-display text-4xl font-bold text-text-primary mb-2">
                    Crea tu Pastel Personalizado
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Elige cada detalle para diseñar el pastel de tus sueños. ¡Nosotros lo hacemos realidad!
                </p>
            </motion.div>

            {/* Layout de 2 columnas: Opciones (izq) y Visualizador (der) */}
            <div className="flex flex-col md:flex-row md:items-start gap-8 lg:gap-12">
                
                {/* ===== COLUMNA IZQUIERDA: OPCIONES ===== */}
                <div className="order-2 md:order-1 w-full md:w-3/5 space-y-8">
                    {/* Genera una sección por cada categoría (base, relleno, cobertura, etc.) */}
                    {CUSTOM_CAKE_OPTIONS.map((section, index) => (
                        <motion.div 
                            key={section.id}
                            custom={index}
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Título de la sección con numeración */}
                            <h3 className="text-xl font-bold font-serif-display border-b-2 border-accent pb-2 mb-4">
                                {index + 1}. {section.name}
                            </h3>
                            
                            {/* Grid responsivo de botones para cada opción */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {section.options.map(option => (
                                    <motion.button 
                                        key={option.id}
                                        onClick={() => handleSelect(section.id, option.id)}
                                        className={`p-3 text-center rounded-xl border-2 ${
                                            // Estilos diferentes si está seleccionado
                                            selections[section.id] === option.id 
                                                ? 'border-secondary bg-secondary/10 shadow-md' // Seleccionado
                                                : 'border-gray-200' // No seleccionado
                                        }`}
                                        variants={optionButtonVariants}
                                        animate={selections[section.id] === option.id ? "selected" : "unselected"}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <p className="font-semibold text-sm">{option.name}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ===== COLUMNA DERECHA: VISUALIZADOR Y RESUMEN ===== */}
                <div className="order-1 md:order-2 w-full md:w-2/5 md:sticky md:top-24 h-fit z-10 mb-8 md:mb-0">
                    {/* ===== VISUALIZADOR DE PASTEL (IMAGEN DINÁMICA) ===== */}
                    {/* La key con JSON.stringify(selections) fuerza un re-render cuando cambia alguna selección */}
                    {/* Esto dispara la animación cada vez que cambias una opción */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={JSON.stringify(selections)}
                            className="relative aspect-square w-full rounded-2xl bg-gray-100 overflow-hidden shadow-lg border-4 border-white"
                            variants={visualizerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {/* Placeholder de fondo (se muestra detrás de las imágenes) */}
                            <div className="absolute inset-0 flex items-center justify-center -z-10">
                                <div className="text-center text-gray-400 p-4">
                                    <motion.span 
                                        className="material-symbols-outlined text-5xl block"
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        palette
                                    </motion.span>
                                    <p className="font-semibold mt-2">Observa cómo se construye tu pastel</p>
                                    <p className="text-xs mt-1">Las imágenes son representativas de cada capa.</p>
                                </div>
                            </div>
                            
                            {/* ===== SISTEMA DE CAPAS: RENDERIZA IMÁGENES SUPERPUESTAS ===== */}
                            {/* Cada sección tiene una imagen que se superpone sobre las anteriores */}
                            <AnimatePresence>
                                {CUSTOM_CAKE_OPTIONS.map((section, index) => {
                                    const selectedOptionId = selections[section.id]; // ID de la opción seleccionada
                                    const selectedOption = section.options.find(opt => opt.id === selectedOptionId); // Objeto completo
                                    
                                    // Si hay opción seleccionada Y no es "size" (tamaño no tiene imagen)
                                    if (selectedOption && section.id !== 'size') {
                                        return (
                                            <motion.img 
                                                key={`${section.id}-${selectedOptionId}`}
                                                src={selectedOption.image} 
                                                alt={selectedOption.name} 
                                                className="absolute inset-0 w-full h-full object-contain" 
                                                style={{ zIndex: index }} // z-index basado en el orden: base abajo, decoraciones arriba
                                                variants={layerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                            />
                                        );
                                    }
                                    return null; // No renderiza nada si no hay imagen
                                })}
                            </AnimatePresence>
                            {/* EJEMPLO DE CAPAS:
                             * zIndex 0: Imagen de base (chocolate)
                             * zIndex 1: Imagen de relleno (fresa)
                             * zIndex 2: Imagen de cobertura (fondant)
                             * zIndex 3: Imagen de decoración (flores)
                             * Resultado: todas superpuestas formando el pastel completo
                             */}
                        </motion.div>
                    </AnimatePresence>
                     
                     {/* ===== CARD DE RESUMEN Y COTIZACIÓN ===== */}
                     <motion.div 
                         className="mt-6 p-4 rounded-2xl bg-white shadow-lg border border-gray-100"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3, duration: 0.5 }}
                     >
                         <h3 className="font-bold text-lg font-serif-display mb-3">Tu Selección:</h3>
                         
                         {/* Lista de todas las opciones seleccionadas */}
                         <motion.ul 
                             className="space-y-1 text-sm text-text-secondary"
                             initial="hidden"
                             animate="visible"
                         >
                            {CUSTOM_CAKE_OPTIONS.map((section, index) => {
                                const selectedOption = section.options.find(opt => opt.id === selections[section.id]);
                                return (
                                    <motion.li 
                                        key={section.id} 
                                        className="flex justify-between"
                                        custom={index}
                                        variants={summaryItemVariants}
                                    >
                                        <span className="font-medium text-text-primary">{section.name}:</span>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={selectedOption?.id}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {selectedOption?.name || 'No seleccionado'}
                                            </motion.span>
                                        </AnimatePresence>
                                    </motion.li>
                                );
                            })}
                         </motion.ul>
                         
                         {/* Notas informativas */}
                         <motion.div 
                             className="mt-4 text-xs text-text-secondary space-y-2 bg-gray-50 p-3 rounded-lg"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 0.5 }}
                         >
                             <p><span className="font-bold">Nota 1:</span> Si tienes una imagen de referencia, puedes adjuntarla al enviar tu pedido por WhatsApp.</p>
                             <p><span className="font-bold">Nota 2:</span> Los precios pueden variar dependiendo de la complejidad y disponibilidad de ingredientes.</p>
                         </motion.div>
                         
                         {/* Botón de WhatsApp para cotizar */}
                         <motion.button 
                            onClick={generateWhatsAppMessage} 
                            className="mt-4 bg-[#25D366] text-white flex w-full items-center justify-center gap-2 rounded-full py-3 px-5 text-base font-bold shadow-lg"
                            whileHover={{ 
                                y: -3,
                                boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                         >
                            {/* Logo de WhatsApp (SVG) */}
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2.001c-5.503 0-9.972 4.47-9.972 9.971 0 1.761.46 3.486 1.34 4.978l-1.39 5.093 5.215-1.373c1.472.82 3.12 1.258 4.807 1.258h.001c5.502 0 9.971-4.47 9.971-9.971s-4.469-9.97-9.971-9.97zm0 17.94c-1.574 0-3.11-.472-4.43-1.365l-.316-.187-3.268.861.87-3.197-.206-.328c-.985-1.564-1.503-3.411-1.503-5.328 0-4.596 3.737-8.332 8.332-8.332 4.594 0 8.33 3.736 8.33 8.332s-3.736 8.332-8.33 8.332zm3.32-5.463c-.183-.3-.642-.48-1.353-.807-.71-.326-4.2-2.053-4.858-2.288-.658-.234-1.135-.125-1.135.597 0 .346.402.597.55.777.149.179.317.402.485.617.168.215.337.234.622.062.285-.172.932-.341 1.777-1.09.845-.75 1.408-1.51 1.576-1.761.168-.25.168-.465.077-.617-.091-.151-.234-.366-.485-.617s-.418-.47-.622-.705c-.204-.234-.234-.191-.403-.465s-.34-.597-.465-.847c-.125-.25-.25-.213-.34-.213h-.452c-.172 0-.465.062-.71.303-.246.242-.932.912-.932 2.228 0 1.316.95 2.57 1.08 2.75.129.179 1.8 2.768 4.31 3.841 2.512 1.072 2.512.715 2.797.668.285-.047.933-.38 1.062-.75.129-.37.129-.687.091-.75s-.148-.094-.337-.187z"/></svg>
                            <span>Cotizar por WhatsApp</span>
                        </motion.button>
                     </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CustomCakePage;

/* ===== MEJORAS IMPLEMENTADAS CON FRAMER MOTION =====

✅ SECCIONES DE OPCIONES:
- Stagger animation (aparecen una por una)
- Cada sección con delay incremental

✅ BOTONES DE OPCIONES:
- Hover: Se elevan 2px con sombra
- Tap: Scale 0.95
- Selected: Cambia border color suavemente
- Transiciones fluidas

✅ VISUALIZADOR DE PASTEL:
- AnimatePresence mode="wait" al cambiar selecciones
- Spring animation al aparecer
- Ícono de paleta con wiggle infinito

✅ CAPAS DEL PASTEL:
- AnimatePresence para cada capa
- Fade in/out al cambiar opciones
- Sistema de z-index mantenido

✅ RESUMEN:
- Items con stagger
- AnimatePresence en valores seleccionados
- Slide lateral al cambiar

✅ BOTÓN WHATSAPP:
- Hover: Se eleva 3px
- Tap: Scale 0.98
- Aparece con delay y slide up

✅ MANTIENE:
- Todos los comentarios originales
- Estructura del código
- Sistema de capas
- Lógica de negocio

*/