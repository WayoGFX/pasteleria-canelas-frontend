import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { BUSINESS_NAME, WHATSAPP_NUMBER } from '../constants';

//VARIANTES DE ANIMACIÓN
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
    // obtiene todas las funciones y estados del carrito desde el Context
    const { isCartOpen, toggleCart, cartItems, updateQuantity, totalPrice, removeFromCart, clearCart } = useCart();
    
    // estado local para las notas del pedido (opcional)
    const [orderNotes, setOrderNotes] = useState('');
    
    // estado para mostrar/ocultar el modal de confirmación antes de ir a WhatsApp
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // GENERAR MENSAJE DE WHATSAPP 
    const generateWhatsAppMessage = () => {
        // construye el mensaje con formato
        let message = `¡Hola ${BUSINESS_NAME}! Me gustaría hacer un pedido:\n\n`;
        
        // agrega cada item del carrito
        cartItems.forEach(item => {
            message += `- ${item.quantity} x ${item.name} (${item.selectedPrice.size})\n`;
        });

        // si hay notas adicionales, las agrega
        if (orderNotes.trim()) {
            message += `\n*Notas Adicionales:*\n${orderNotes.trim()}\n`;
        }
        
        // agrega el total al final
        message += `\n*Total: $${totalPrice.toFixed(2)}*\n\n¡Muchas gracias!`;

        // codifica el mensaje para URL y abre WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    };

    // muestra el modal de confirmación antes de enviar a WhatsApp
    const handleFinalizeOrder = () => {
        setShowConfirmationModal(true);
    };

    return (
        <>
            {/* OVERLAY OSCURO*/}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div 
                        className="fixed inset-0 z-40 bg-black/50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={toggleCart} // cierra el carrito al hacer clic fuera
                    />
                )}
            </AnimatePresence>
            
            {/* SIDEBAR DEL CARRITO*/}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div 
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-primary shadow-2xl"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* estructura flex para header fijo, contenido scrolleable y footer fijo */}
                        <div className="flex flex-col h-full">
                            
                            {/* HEADER DEL CARRITO*/}
                            <motion.header 
                                className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                <div className="flex items-baseline gap-3">
                                    <h3 className="font-serif-display text-2xl font-bold">Tu Carrito</h3>
                                    
                                    {/* botón vaciar solo si hay items */}
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
                                
                                {/* botón X para cerrar */}
                                <motion.button 
                                    onClick={toggleCart} 
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </motion.button>
                            </motion.header>
                            
                            {/* CONTENIDO DEL CARRITO */}
                            <div className="flex-grow p-4 overflow-y-auto">
                                {/* si el carrito está vacío */}
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
                                    // si hay productos, muestra la lista
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
                                                    {/* imagen del producto */}
                                                    <motion.div 
                                                        className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0" 
                                                        style={{ backgroundImage: `url('${item.image}')` }}
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                    
                                                    {/* información del producto */}
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
                                                    
                                                    {/* control de cantidad + | - */}
                                                    <div className="flex items-center gap-2">
                                                        {/* botón decrementar */}
                                                        <motion.button 
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                                            className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-text-primary transition-colors hover:bg-gray-300"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            -
                                                        </motion.button>
                                                        
                                                        {/* cantidad actual */}
                                                        <motion.span 
                                                            className="font-bold text-md w-6 text-center"
                                                            key={`qty-${item.id}-${item.quantity}`}
                                                            initial={{ scale: 1.3 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            {item.quantity}
                                                        </motion.span>
                                                        
                                                        {/* botón incrementar */}
                                                        <motion.button 
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                                            className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 text-text-primary transition-colors hover:bg-gray-300"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            +
                                                        </motion.button>
                                                    </div>
                                                    
                                                    {/* botón eliminar */}
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
                            
                            {/* FOOTER DEL CARRITO solo si hay items*/}
                            <AnimatePresence>
                                {cartItems.length > 0 && (
                                    <motion.footer 
                                        className="p-4 border-t border-gray-200 bg-primary shrink-0"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* campo de notas opcionales */}
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
                                        
                                        {/* nota de tips */}
                                        <motion.p 
                                            className="text-xs text-center text-text-secondary mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Nota: El precio de envío puede variar dependiendo de tu ubicación.
                                        </motion.p>
                                        
                                        {/* total del pedido */}
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
                                        
                                        {/* botón finalizar por WhatsApp */}
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
                                            {/* logo de WhatsApp */}
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                            <span>Finalizar por WhatsApp</span>
                                        </motion.button>
                                    </motion.footer>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DE CONFIRMACIÓN*/}
            {/* solo se muestra si showConfirmationModal es true */}
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
                            {/* icono */}
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
                            
                            {/* título */}
                            <motion.h3 
                                className="text-xl font-bold font-serif-display text-text-primary"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                Estás a un paso de WhatsApp
                            </motion.h3>
                            
                            {/* mensaje explicativo */}
                            <motion.p 
                                className="mt-2 text-sm text-text-secondary"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                ¡Gracias! Hemos preparado tu mensaje. Una vez que lo envíes en WhatsApp, nuestro equipo te responderá en un plazo aproximado de 15 minutos para confirmar tu pedido y coordinar el pago y la entrega. Tu pedido no está confirmado hasta que recibas nuestra respuesta.
                            </motion.p>
                            
                            {/* botones de acción */}
                            <motion.div 
                                className="mt-6 flex flex-col sm:flex-row-reverse gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {/* botón confirmar | manda a whatsapp */}
                                <motion.button 
                                    onClick={() => {
                                        generateWhatsAppMessage(); // genera y abre WhatsApp
                                        setShowConfirmationModal(false); // cierra el modal
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