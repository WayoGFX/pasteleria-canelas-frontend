import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CUSTOM_CAKE_OPTIONS, WHATSAPP_NUMBER, BUSINESS_NAME } from '../constants';
import { CustomCakeSelection } from '../types';
import Breadcrumbs from './Breadcrumbs';

// VARIANTES DE ANIMACIÓN 
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
        borderColor: 'rgb(229, 231, 235)' // gra
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
    // INICIALIZACIÓN DEL ESTADO
    // useMemo para calcular las selecciones iniciales solo una vez
    const initialSelections = useMemo(() => {
        // recorre todas las secciones base, relleno, cobertura, etc.
        return CUSTOM_CAKE_OPTIONS.reduce((acc, section) => {
            // Para cada sección, selecciona automáticamente la primera opción
            acc[section.id] = section.options[0]?.id || null;
            return acc;
        }, {} as CustomCakeSelection);
        // { base: "vainilla", relleno: "chocolate",}
    }, []); // [] = solo se ejecuta una vez al montar el componente

    // estado que guarda todas las selecciones del usuario
    // { base: "vainilla", relleno: "fresa", cobertura: "fondant"}
    const [selections, setSelections] = useState<CustomCakeSelection>(initialSelections);

    // función que actualiza una selección específica al hacer clic
    const handleSelect = (sectionId: string, optionId: string) => {
        setSelections(prev => ({
            ...prev, // mantiene todas las selecciones anteriores
            [sectionId]: optionId, // actualiza solo la sección que cambió
        }));
    };

    // genera el mensaje de WhatsApp con todas las opciones seleccionadas
    const generateWhatsAppMessage = () => {
        let message = `¡Hola ${BUSINESS_NAME}! Me gustaría cotizar un pastel personalizado con las siguientes características:\n\n`;
        
        // recorre cada sección y agrega la opción seleccionada al mensaje
        CUSTOM_CAKE_OPTIONS.forEach(section => {
            const selectedOptionId = selections[section.id]; // ID de la opción seleccionada
            const selectedOption = section.options.find(opt => opt.id === selectedOptionId); // Busca el objeto completo
            
            if (selectedOption) {
                // Agrega línea formateada con negrita en WhatsApp 
                message += `*${section.name}:* ${selectedOption.name}\n`;
            }
        });

        message += `\n¡Quedo a la espera de la cotización, muchas gracias!`;

        // codifica el mensaje para URL y abre whatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    // migajas de pan para navegación
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
             
             {/* encabezado de la página */}
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

            {/* layout de 2 columnas Opciones y Visualizador */}
            <div className="flex flex-col md:flex-row md:items-start gap-8 lg:gap-12">
                
                {/* OPCIONES */}
                <div className="order-2 md:order-1 w-full md:w-3/5 space-y-8">
                    {/* Genera una sección por cada categoría base, relleno, cobertura */}
                    {CUSTOM_CAKE_OPTIONS.map((section, index) => (
                        <motion.div 
                            key={section.id}
                            custom={index}
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* título de la sección con numeración */}
                            <h3 className="text-xl font-bold font-serif-display border-b-2 border-accent pb-2 mb-4">
                                {index + 1}. {section.name}
                            </h3>
                            
                            {/* botones para cada opción */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {section.options.map(option => (
                                    <motion.button 
                                        key={option.id}
                                        onClick={() => handleSelect(section.id, option.id)}
                                        className={`p-3 text-center rounded-xl border-2 ${
                                            // estilos diferentes si está seleccionado
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

                {/* COLUMNA DERECHA: VISUALIZADOR Y RESUMEN */}
                <div className="order-1 md:order-2 w-full md:w-2/5 md:sticky md:top-24 h-fit z-10 mb-8 md:mb-0">
                    {/* VISUALIZADOR DE PASTEL IMAGEN DINÁMICA */}
                    <motion.div
                        className="relative aspect-square w-full rounded-2xl bg-gray-100 overflow-hidden shadow-lg border-4 border-white"
                        variants={visualizerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* IMAGEN DE BASE ESTÁTICA */}
                        <motion.img
                            src="/assets/personalizados/base.jpg"
                            alt="Base del pastel"
                            className="absolute inset-0 w-full h-full object-contain"
                            style={{ zIndex: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        
                        {/* CAPAS DINÁMICAS SUPERPUESTAS */}
                        <AnimatePresence>
                            {CUSTOM_CAKE_OPTIONS.map((section, index) => {
                                const selectedOptionId = selections[section.id];
                                const selectedOption = section.options.find(opt => opt.id === selectedOptionId);
                                
                                // IDs de secciones que no deben renderizar una imagen
                                const nonVisibleIds: string[] = [];

                                // Renderiza
                                // La opción está seleccionada

                                if (selectedOption && selectedOption.image && !selectedOption.image.includes('invisible') && !nonVisibleIds.includes(section.id)) {
                                    return (
                                        <motion.img 
                                            key={`${section.id}-${selectedOptionId}`}
                                            src={selectedOption.image} 
                                            alt={selectedOption.name} 
                                            className="absolute inset-0 w-full h-full object-contain"
                                            // Las capas empiezan en z-index 1 para estar sobre la base estática
                                            style={{ zIndex: index + 1 }}
                                            variants={layerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                        />
                                    );
                                }
                                return null;
                            })}
                        </AnimatePresence>

                        {/* Placeholder de fondo */}
                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                            <p className="text-center text-gray-400 p-4">Observa cómo se construye tu pastel</p>
                        </div>
                    </motion.div>
                     
                     {/* CARD DE RESUMEN */}
                     <motion.div 
                         className="mt-6 p-4 rounded-2xl bg-white shadow-lg border border-gray-100"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3, duration: 0.5 }}
                     >
                         <h3 className="font-bold text-lg font-serif-display mb-3">Tu Selección:</h3>
                         
                         {/* lista de todas las opciones seleccionadas */}
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
                         
                         {/* notas informativas */}
                         <motion.div 
                             className="mt-4 text-xs text-text-secondary space-y-2 bg-gray-50 p-3 rounded-lg"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 0.5 }}
                         >
                             <p><span className="font-bold">Nota 1:</span> Si tienes una imagen de referencia, puedes adjuntarla al enviar tu pedido por WhatsApp.</p>
                             <p><span className="font-bold">Nota 2:</span> Los precios pueden variar dependiendo de la complejidad y disponibilidad de ingredientes.</p>
                         </motion.div>
                         
                         {/* botón de WhatsApp para cotizarrrr */}
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
                            {/* logo de WhatsApp */}
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            <span>Cotizar por WhatsApp</span>
                        </motion.button>
                     </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CustomCakePage;
