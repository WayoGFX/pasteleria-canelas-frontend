import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion
import { Product as ProductType } from '../types';
import { useCart } from '../context/CartContext';

// Card de producto

const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
    // hooks y estados
    const { addToCart } = useCart();
    const navigate = useNavigate();
    // estado para la animación del botón añadido
    const [isAdded, setIsAdded] = useState(false); 
    
    // información del producto 
    // Obtiene el primer precio si existe
    const firstPrice = product.prices?.[0];
    // determina si el producto tiene múltiples opciones de precio
    const hasOptions = product.prices.length > 1;
    // identifica si es un pastel personalizado | estos no tienen precio
    const isCustomCake = product.category === 'personalizados';
    // producto sin precio y que NO es personalizado | como hay unos sin precio se pone para cotizarlo
    const noPriceAndNotCustom = !firstPrice && !isCustomCake;
    
    // preguntar si el producto se puede añadir directamente al carrito
    // este NO es personalizado NO tiene opciones múltiples SÍ tiene precio
    const canBeAddedDirectly = !isCustomCake && !hasOptions && !noPriceAndNotCustom && !!firstPrice;

    // maneja el clic en el botón al añadir al carrito o ir a detalles
    const handleActionClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Evita que el Link del padre se active
        if (isAdded) return; // no hace nada si ya se añadió

        if (canBeAddedDirectly) {
            // si se puede añadir directamente lo agrega al carrito
            addToCart(product, firstPrice, 1);
            setIsAdded(true);
            // resetea el estado después de 2 segundos
            setTimeout(() => setIsAdded(false), 2000);
        } else {
            // redirige a la página de detalles del producto
            navigate(`/product/${product.id}`);
        }
    };

    // función que determina el texto ícono y estilos del botón según el estado del producto
    const getButtonProps = () => {
        // si ya se añadió al carrito
        if (isAdded) {
            return {
                text: '¡Añadido!',
                icon: 'check_circle',
                classes: 'bg-green-500 text-white border-green-500',
            };
        }
        
        // si es un pastel personalizado
        if (isCustomCake) {
            return {
                text: 'Ver Detalles',
                icon: 'palette', // icono de paleta
                classes: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
            };
        }
        
        // si tiene múltiples opciones o no tiene precio
        if (hasOptions || noPriceAndNotCustom) {
            return {
                text: 'Ver Opciones',
                icon: 'arrow_forward',
                classes: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
            };
        }

        // Caso por defecto de productos normales con precio
        return {
            text: 'Añadir',
            icon: 'add_shopping_cart',
            classes: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
        };
    };

    // obtiene las propiedades del botón según el estado actual
    const buttonProps = getButtonProps();

    return (
        // contenedor principal de productos pero con animaciones de motion
        <motion.div 
            className="flex flex-col h-full rounded-2xl bg-card-bg shadow-lg overflow-hidden"
            whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)" // Sombra 
            }}
            transition={{ 
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            {/* IMAGEN DEL PRODUCTO*/}
            {/* redireccioana a los detalles */}
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                <motion.div 
                    className="aspect-square w-full relative"
                    // zoom al hacer hover en la card
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                >
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy" 
                        // transición de escala
                        className="w-full h-full object-cover" 
                    />
                    
                    {/* overlay sutil que aparece en hover */}
                    <motion.div
                        className="absolute inset-0 bg-black/0"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>
            </Link>
            
            {/* INFORMACIÓN DEL PRODUCTO */}
            <div className="flex-grow flex flex-col p-3">
                {/* Nombre del producto */}
                <Link to={`/product/${product.id}`} className="block">
                    <motion.h3 
                        className="font-bold text-md mt-1 line-clamp-2"
                        // cambio de color hover
                        whileHover={{ color: "var(--secondary)" }}
                        transition={{ duration: 0.2 }}
                    >
                        {product.name}
                    </motion.h3>
                </Link>
                
                {/* precio o indicador según el tipo de producto */}
                <p className="text-sm text-secondary font-bold min-h-[20px] mb-3">
                    {isCustomCake 
                        ? 'Personalizable' 
                        : firstPrice 
                            ? `$${firstPrice.price.toFixed(2)}${hasOptions ? ' (desde)' : ''}`
                            : 'Consultar precio' // si no hay precio
                    }
                </p>
                
                {/* botón con animación */}
                <motion.button 
                    onClick={handleActionClick} 
                    disabled={isAdded} // deshabilitado mientras muestra ¡Añadido!
                    className={`mt-auto w-full flex items-center justify-center gap-2 rounded-full py-2 px-3 text-sm font-bold shadow-md transition-colors ${buttonProps.classes}`}
                    // animacion
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                    // Efecto de
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* animación del ícono:*/}
                    <AnimatePresence mode="wait"> 
                        <motion.span 
                            key={buttonProps.icon} // clave para que AnimatePresence detecte ícono
                            className="material-symbols-outlined text-lg"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {buttonProps.icon}
                        </motion.span>
                    </AnimatePresence>
                    
                    {/* animación del texto */}
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={buttonProps.text} // clave para detectar el cambio de texto
                            initial={{ opacity: 0, y: 10 }} // entra desde abajo
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }} // sale hacia arriba
                            transition={{ duration: 0.2 }}
                        >
                            {buttonProps.text}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProductCard;