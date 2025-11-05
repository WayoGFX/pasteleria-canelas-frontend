import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Importación de Framer Motion
import { Product as ProductType } from '../types';
import { useCart } from '../context/CartContext';

// ===== PRODUCT CARD CON FRAMER MOTION =====
// Card de producto con animaciones fluidas y estados visuales claros

const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
    // Hooks y Estados
    const { addToCart } = useCart();
    const navigate = useNavigate();
    // Estado para la animación del botón "añadido"
    const [isAdded, setIsAdded] = useState(false); 
    
    // Información del producto (Lógica del archivo original)
    // Obtiene el primer precio (si existe)
    const firstPrice = product.prices?.[0];
    // Determina si el producto tiene múltiples opciones de precio/tamaño
    const hasOptions = product.prices.length > 1;
    // Identifica si es un pastel personalizado
    const isCustomCake = product.category === 'personalizados';
    // Producto sin precio y que NO es personalizado (requiere cotización)
    const noPriceAndNotCustom = !firstPrice && !isCustomCake;
    
    // Determina si el producto se puede añadir directamente al carrito
    // Condiciones: NO es personalizado, NO tiene opciones múltiples, SÍ tiene precio
    const canBeAddedDirectly = !isCustomCake && !hasOptions && !noPriceAndNotCustom && !!firstPrice;

    // Maneja el clic en el botón (añadir al carrito o ir a detalles)
    const handleActionClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Evita que el Link del padre se active
        if (isAdded) return; // No hace nada si ya se añadió (previene doble clic)

        if (canBeAddedDirectly) {
            // Si se puede añadir directamente, lo agrega al carrito
            addToCart(product, firstPrice, 1);
            setIsAdded(true);
            // Resetea el estado después de 2 segundos
            setTimeout(() => setIsAdded(false), 2000);
        } else {
            // Si no, redirige a la página de detalles del producto
            navigate(`/product/${product.id}`);
        }
    };

    // Función que determina el texto, ícono y estilos del botón según el estado del producto
    const getButtonProps = () => {
        // Si ya se añadió al carrito
        if (isAdded) {
            return {
                text: '¡Añadido!',
                icon: 'check_circle',
                classes: 'bg-green-500 text-white border-green-500',
            };
        }
        
        // Si es un pastel personalizado
        if (isCustomCake) {
            return {
                text: 'Ver Detalles',
                icon: 'palette', // Ícono de paleta
                classes: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
            };
        }
        
        // Si tiene múltiples opciones o no tiene precio
        if (hasOptions || noPriceAndNotCustom) {
            return {
                text: 'Ver Opciones',
                icon: 'arrow_forward',
                classes: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
            };
        }

        // Caso por defecto: producto simple con un solo precio
        return {
            text: 'Añadir',
            icon: 'add_shopping_cart',
            classes: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
        };
    };

    // Obtiene las propiedades del botón según el estado actual
    const buttonProps = getButtonProps();

    return (
        // Contenedor principal de la Card, ahora es un 'motion.div'
        <motion.div 
            className="flex flex-col h-full rounded-2xl bg-card-bg shadow-lg overflow-hidden"
            // Hover: Se eleva (y: -8) y aumenta la sombra (reemplaza la clase hover:-translate-y-1 y hover:shadow-glow-secondary de Tailwind)
            whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)" // Sombra más rica que la de Tailwind
            }}
            // Transición general de la tarjeta (para y y sombra)
            transition={{ 
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            {/* ===== IMAGEN DEL PRODUCTO ===== */}
            {/* Link a la página de detalles del producto */}
            <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                <motion.div 
                    className="aspect-square w-full relative"
                    // Zoom al hacer hover en la card (reemplaza group-hover:scale-110)
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                >
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy" 
                        // La transición de escala ahora la maneja el motion.div padre, no la imagen directamente
                        className="w-full h-full object-cover" 
                    />
                    
                    {/* Overlay sutil que aparece en hover */}
                    <motion.div
                        className="absolute inset-0 bg-black/0"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>
            </Link>
            
            {/* ===== INFORMACIÓN DEL PRODUCTO ===== */}
            <div className="flex-grow flex flex-col p-3">
                {/* Nombre del producto */}
                <Link to={`/product/${product.id}`} className="block">
                    <motion.h3 
                        className="font-bold text-md mt-1 line-clamp-2"
                        // Cambio de color en hover
                        whileHover={{ color: "var(--secondary)" }}
                        transition={{ duration: 0.2 }}
                    >
                        {product.name}
                    </motion.h3>
                </Link>
                
                {/* Precio o indicador según el tipo de producto */}
                <p className="text-sm text-secondary font-bold min-h-[20px] mb-3">
                    {isCustomCake 
                        ? 'Personalizable' 
                        : firstPrice 
                            ? `$${firstPrice.price.toFixed(2)}${hasOptions ? ' (desde)' : ''}` // Muestra "desde" si hay múltiples precios
                            : 'Consultar precio' // Sin precio disponible
                    }
                </p>
                
                {/* Botón de acción con animación */}
                <motion.button 
                    onClick={handleActionClick} 
                    disabled={isAdded} // Deshabilitado mientras muestra "¡Añadido!"
                    className={`mt-auto w-full flex items-center justify-center gap-2 rounded-full py-2 px-3 text-sm font-bold shadow-md transition-colors ${buttonProps.classes}`}
                    // Hover: Se eleva un poco y agrega una sombra sutil
                    whileHover={{ 
                        y: -2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                    // Tap/Click: Efecto de "presionar"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Animación del ícono: usa AnimatePresence para un switch animado de íconos (Añadir -> Check) */}
                    <AnimatePresence mode="wait"> 
                        <motion.span 
                            key={buttonProps.icon} // Clave para que AnimatePresence detecte el cambio de ícono
                            className="material-symbols-outlined text-lg"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            {buttonProps.icon}
                        </motion.span>
                    </AnimatePresence>
                    
                    {/* Animación del texto: también usa AnimatePresence para un switch animado de texto (Añadir -> ¡Añadido!) */}
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={buttonProps.text} // Clave para detectar el cambio de texto
                            initial={{ opacity: 0, y: 10 }} // Entra desde abajo
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }} // Sale hacia arriba
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