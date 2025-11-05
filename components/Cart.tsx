import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { BUSINESS_NAME, WHATSAPP_NUMBER } from '../constants';

// ===== VARIANTES DE ANIMACIÓN PARA FRAMER MOTION =====
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const sidebarVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    x: '100%',
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3
    }
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const emptyCartVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
};

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 }
  }
};

const Cart: React.FC = () => {
    // Obtiene todas las funciones y estados del carrito desde el Context
    const { isCartOpen, toggleCart, cartItems, updateQuantity, totalPrice, removeFromCart, clearCart } = useCart();
    
    // Estado local para las notas del pedido (opcional)
    const [orderNotes, setOrderNotes] = useState('');
    
    // Estado para mostrar/ocultar el modal de confirmación antes de ir a WhatsApp
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // ===== FUNCIÓN: GENERAR MENSAJE DE WHATSAPP =====
    const generateWhatsAppMessage = () => {
        // Construye el mensaje con formato
        let message = `¡Hola ${BUSINESS_NAME}! Me gustaría hacer un pedido:\n\n`;
        
        // Agrega cada item del carrito
        cartItems.forEach(item => {
            message += `- ${item.quantity} x ${item.name} (${item.selectedPrice.size})\n`;
        });

        // Si hay notas adicionales, las agrega
        if (orderNotes.trim()) {
            message += `\n*Notas Adicionales:*\n${orderNotes.trim()}\n`;
        }
        
        // Agrega el total al final
        message += `\n*Total: $${totalPrice.toFixed(2)}*\n\n¡Muchas gracias!`;

        // Codifica el mensaje para URL y abre WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    // Muestra el modal de confirmación antes de enviar a WhatsApp
    const handleFinalizeOrder = () => {
        setShowConfirmationModal(true);
    };

    return (
        <>
            {/* ===== OVERLAY OSCURO (Fondo semi-transparente) ===== */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div 
                        className="fixed inset-0 z-40 bg-black/50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={toggleCart} // Cierra el carrito al hacer clic fuera
                    />
                )}
            </AnimatePresence>
            
            {/* ===== SIDEBAR DEL CARRITO (Panel lateral derecho) ===== */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div 
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-primary shadow-2xl"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Estructura flex para header fijo, contenido scrolleable y footer fijo */}
                        <div className="flex flex-col h-full">
                            
                            {/* ===== HEADER DEL CARRITO ===== */}
                            <motion.header 
                                className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                <div className="flex items-baseline gap-3">
                                    <h3 className="font-serif-display text-2xl font-bold">Tu Carrito</h3>
                                    
                                    {/* Botón "Vaciar" solo si hay items */}
                                    <AnimatePresence>
                                        {cartItems.length > 0 && (
                                            <motion.button 
                                                onClick={clearCart} 
                                                className="text-sm font-medium text-text-secondary hover:text-red-500 hover:underline transition-colors"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Vaciar
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                {/* Botón X para cerrar */}
                                <motion.button 
                                    onClick={toggleCart} 
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </motion.button>
                            </motion.header>
                            
                            {/* ===== CONTENIDO DEL CARRITO (scrolleable) ===== */}
                            <div className="flex-grow p-4 overflow-y-auto">
                                {/* Si el carrito está vacío */}
                                {cartItems.length === 0 ? (
                                    <motion.div 
                                        className="flex flex-col items-center justify-center h-full text-center text-text-secondary"
                                        variants={emptyCartVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.span 
                                            className="material-symbols-outlined text-6xl mb-4"
                                            animate={{ 
                                                rotate: [0, -10, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ 
                                                duration: 1,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            shopping_cart_off
                                        </motion.span>
                                        <p className="font-bold">Tu carrito está vacío</p>
                                        <p className="text-sm">Añade algunos productos para empezar.</p>
                                    </motion.div>
                                ) : (
                                    // Si hay productos, muestra la lista
                                    <motion.div 
                                        className="space-y-4"
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {cartItems.map((item, index) => (
                                                <motion.div 
                                                    key={item.id} 
                                                    className="flex items-center gap-4"
                                                    custom={index}
                                                    variants={itemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    layout
                                                >
                                                    {/* Imagen del producto */}
                                                    <motion.div 
                                                        className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0" 
                                                        style={{ backgroundImage: `url('${item.image}')` }}
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                    
                                                    {/* Información del producto */}
                                                    <div className="flex-grow">
                                                        <p className="font-bold">{item.name}</p>
                                                        <p className="text-sm text-text-secondary">{item.selectedPrice.size}</p>
                                                        <motion.p 
                                                            className="font-bold text-secondary mt-1"
                                                            key={item.quantity}
                                                            initial={{ scale: 1.2 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            ${(item.selectedPrice.price * item.quantity).toFixed(2)}
                                                        </motion.p>
                                                    </div>
                                                    
                                                    {/* Control de cantidad (+/-) */}
                                                    <div className="flex items-center gap-2">
                                                        {/* Botón decrementar */}
                                                        <motion.button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                                            className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-text-primary transition-colors hover:bg-gray-300"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            -
                                                        </motion.button>
                                                        
                                                        {/* Cantidad actual */}
                                                        <motion.span 
                                                            className="font-bold text-md w-6 text-center"
                                                            key={`qty-${item.id}-${item.quantity}`}
                                                            initial={{ scale: 1.3 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            {item.quantity}
                                                        </motion.span>
                                                        
                                                        {/* Botón incrementar */}
                                                        <motion.button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                                            className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-text-primary transition-colors hover:bg-gray-300"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            +
                                                        </motion.button>
                                                    </div>
                                                    
                                                    {/* Botón eliminar */}
                                                    <motion.button 
                                                        onClick={() => removeFromCart(item.id)} 
                                                        aria-label={`Eliminar ${item.name}`} 
                                                        className="p-2 text-text-secondary hover:text-red-500 rounded-full transition-colors"
                                                        whileHover={{ scale: 1.2, rotate: 15 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </div>
                            
                            {/* ===== FOOTER DEL CARRITO (solo si hay items) ===== */}
                            <AnimatePresence>
                                {cartItems.length > 0 && (
                                    <motion.footer 
                                        className="p-4 border-t border-gray-200 bg-primary shrink-0"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Campo de notas opcionales */}
                                        <div className="mb-4">
                                            <label htmlFor="order-notes" className="block text-sm font-medium text-text-primary mb-1">
                                                Notas para tu pedido (opcional)
                                            </label>
                                            <motion.textarea
                                                id="order-notes"
                                                rows={2}
                                                value={orderNotes}
                                                onChange={(e) => setOrderNotes(e.target.value)}
                                                placeholder="Ej: Es para un cumpleaños, 'Felicidades, María'"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary text-sm"
                                                whileFocus={{ scale: 1.01 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </div>
                                        
                                        {/* Nota sobre el envío */}
                                        <motion.p 
                                            className="text-xs text-center text-text-secondary mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Nota: El precio de envío puede variar dependiendo de tu ubicación.
                                        </motion.p>
                                        
                                        {/* Total del pedido */}
                                        <motion.div 
                                            className="flex justify-between items-center mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <span className="text-lg font-bold">Total</span>
                                            <motion.span 
                                                className="text-xl font-bold text-secondary"
                                                key={totalPrice}
                                                initial={{ scale: 1.2 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                ${totalPrice.toFixed(2)}
                                            </motion.span>
                                        </motion.div>
                                        
                                        {/* Botón principal: Finalizar por WhatsApp */}
                                        <motion.button 
                                            onClick={handleFinalizeOrder} 
                                            className="bg-[#25D366] text-white flex w-full items-center justify-center gap-2 rounded-full py-3 px-5 text-base font-bold shadow-lg"
                                            whileHover={{ 
                                                y: -3,
                                                boxShadow: "0 10px 30px rgba(37, 211, 102, 0.3)"
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {/* Logo de WhatsApp */}
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2.001c-5.503 0-9.972 4.47-9.972 9.971 0 1.761.46 3.486 1.34 4.978l-1.39 5.093 5.215-1.373c1.472.82 3.12 1.258 4.807 1.258h.001c5.502 0 9.971-4.47 9.971-9.971s-4.469-9.97-9.971-9.97zm0 17.94c-1.574 0-3.11-.472-4.43-1.365l-.316-.187-3.268.861.87-3.197-.206-.328c-.985-1.564-1.503-3.411-1.503-5.328 0-4.596 3.737-8.332 8.332-8.332 4.594 0 8.33 3.736 8.33 8.332s-3.736 8.332-8.33 8.332zm3.32-5.463c-.183-.3-.642-.48-1.353-.807-.71-.326-4.2-2.053-4.858-2.288-.658-.234-1.135-.125-1.135.597 0 .346.402.597.55.777.149.179.317.402.485.617.168.215.337.234.622.062.285-.172.932-.341 1.777-1.09.845-.75 1.408-1.51 1.576-1.761.168-.25.168-.465.077-.617-.091-.151-.234-.366-.485-.617s-.418-.47-.622-.705c-.204-.234-.234-.191-.403-.465s-.34-.597-.465-.847c-.125-.25-.25-.213-.34-.213h-.452c-.172 0-.465.062-.71.303-.246.242-.932.912-.932 2.228 0 1.316.95 2.57 1.08 2.75.129.179 1.8 2.768 4.31 3.841 2.512 1.072 2.512.715 2.797.668.285-.047.933-.38 1.062-.75.129-.37.129-.687.091-.75s-.148-.094-.337-.187z"/></svg>
                                            <span>Finalizar por WhatsApp</span>
                                        </motion.button>
                                    </motion.footer>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== MODAL DE CONFIRMACIÓN ===== */}
            {/* Solo se muestra si showConfirmationModal es true */}
            <AnimatePresence>
                {showConfirmationModal && (
                    <motion.div 
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
                        variants={modalBackdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div 
                            className="bg-primary rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Ícono */}
                            <motion.span 
                                className="material-symbols-outlined text-5xl text-secondary mb-3 block"
                                animate={{ 
                                    rotate: [0, -10, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    duration: 0.8,
                                    ease: "easeInOut"
                                }}
                            >
                                forward_to_inbox
                            </motion.span>
                            
                            {/* Título */}
                            <motion.h3 
                                className="text-xl font-bold font-serif-display text-text-primary"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                Estás a un paso de WhatsApp
                            </motion.h3>
                            
                            {/* Mensaje explicativo */}
                            <motion.p 
                                className="mt-2 text-sm text-text-secondary"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                ¡Gracias! Hemos preparado tu mensaje. Una vez que lo envíes en WhatsApp, nuestro equipo te responderá en un plazo aproximado de 15 minutos para confirmar tu pedido y coordinar el pago y la entrega. Tu pedido no está confirmado hasta que recibas nuestra respuesta.
                            </motion.p>
                            
                            {/* Botones de acción */}
                            <motion.div 
                                className="mt-6 flex flex-col sm:flex-row-reverse gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {/* Botón confirmar (abre WhatsApp) */}
                                <motion.button 
                                    onClick={() => {
                                        generateWhatsAppMessage(); // Genera y abre WhatsApp
                                        setShowConfirmationModal(false); // Cierra el modal
                                    }}
                                    className="w-full rounded-full py-3 px-4 text-sm font-bold bg-secondary text-white"
                                    whileHover={{ 
                                        scale: 1.03,
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Entendido, continuar
                                </motion.button>
                                
                                {/* Botón cancelar */}
                                <motion.button 
                                    onClick={() => setShowConfirmationModal(false)}
                                    className="w-full rounded-full py-3 px-4 text-sm font-bold border-2 border-gray-300 text-text-secondary hover:bg-gray-100"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancelar
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Cart;

/* ===== MEJORAS IMPLEMENTADAS CON FRAMER MOTION =====

✅ OVERLAY:
- Fade in/out suave
- Click fuera para cerrar

✅ SIDEBAR:
- Slide desde la derecha con spring
- Header con fade + slide down
- Botón "Vaciar" con AnimatePresence

✅ ITEMS DEL CARRITO:
- Stagger animation (aparecen uno por uno)
- Layout animation al eliminar
- Hover en imagen (zoom)
- Botones +/- con hover/tap
- Cantidad con spring animation
- Precio con bounce al cambiar
- Botón eliminar con rotate

✅ CARRITO VACÍO:
- Ícono con wiggle animation
- Fade + scale

✅ FOOTER:
- Fade + slide up
- Total con bounce
- Botón WhatsApp con hover effect

✅ MODAL:
- Backdrop con fade
- Modal con spring + scale
- Ícono con wiggle
- Botones con hover/tap

*/