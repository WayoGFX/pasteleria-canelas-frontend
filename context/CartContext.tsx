import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { CartItem, Product, ProductPrice } from '../types';

// ===== DEFINICIÓN DEL CONTEXTO =====
// Interface que define todas las funciones y estados disponibles para los componentes que usen el carrito
interface CartContextType {
  cartItems: CartItem[]; // Array de productos en el carrito
  addToCart: (product: Product, selectedPrice: ProductPrice, quantity: number) => void; // Agregar producto
  updateQuantity: (itemId: string, newQuantity: number) => void; // Cambiar cantidad de un item
  removeFromCart: (itemId: string) => void; // Eliminar un item
  clearCart: () => void; // Vaciar todo el carrito
  isCartOpen: boolean; // Estado del sidebar del carrito (abierto/cerrado)
  toggleCart: () => void; // Abrir/cerrar el carrito
  cartCount: number; // Cantidad total de productos (suma de cantidades)
  totalPrice: number; // Precio total del carrito
  notificationMessage: string; // Mensaje de notificación (ej: "Producto añadido")
  isCartAnimating: boolean; // Estado para animación del ícono del carrito
}

// Crea el contexto (inicialmente undefined, se llena en el Provider)
const CartContext = createContext<CartContextType | undefined>(undefined);

// ===== PROVIDER: COMPONENTE QUE ENVUELVE LA APP Y PROVEE EL CARRITO =====
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado principal: array de items en el carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Estado del sidebar (abierto/cerrado)
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Mensaje de notificación temporal
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Estado para animar el ícono del carrito cuando se agrega algo
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // ===== FUNCIÓN: AGREGAR AL CARRITO =====
  // useCallback evita recrear la función en cada render (optimización)
  const addToCart = useCallback((product: Product, selectedPrice: ProductPrice, quantity: number) => {
    setCartItems(prevItems => {
      // Genera un ID único combinando el ID del producto y el tamaño
      // Ejemplo: "pastel-chocolate-mediano" -> permite tener el mismo pastel en diferentes tamaños
      const itemId = `${product.id}-${selectedPrice.size}`;
      
      // Busca si el item ya existe en el carrito
      const existingItem = prevItems.find(item => item.id === itemId);

      if (existingItem) {
        // Si ya existe, solo incrementa la cantidad
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agrega el nuevo item al array
        return [...prevItems, { 
            id: itemId, 
            name: product.name, 
            image: product.image,
            quantity, 
            selectedPrice 
        }];
      }
    });
    
    // Muestra notificación temporal
    setNotificationMessage(`${quantity} x ${product.name} añadido al carrito`);
    
    // Activa la animación del ícono del carrito
    setIsCartAnimating(true);
    
    // Limpia la notificación después de 3 segundos
    setTimeout(() => {
        setNotificationMessage('');
    }, 3000);
    
    // Desactiva la animación después de 600ms (duración de la animación jiggle)
    setTimeout(() => {
        setIsCartAnimating(false);
    }, 600);
  }, []); // [] = no depende de ninguna variable externa, nunca se recrea

  // ===== FUNCIÓN: ACTUALIZAR CANTIDAD =====
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0) // Si la cantidad llega a 0, elimina el item
    );
  }, []);

  // ===== FUNCIÓN: ELIMINAR DEL CARRITO =====
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  // ===== FUNCIÓN: VACIAR CARRITO =====
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // ===== FUNCIÓN: ABRIR/CERRAR SIDEBAR DEL CARRITO =====
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev); // Invierte el estado actual
  }, []);

  // ===== CÁLCULO: CANTIDAD TOTAL DE PRODUCTOS =====
  // useMemo evita recalcular en cada render, solo cuando cambia cartItems
  const cartCount = useMemo(() => {
    // Suma todas las cantidades de todos los items
    return cartItems.reduce((total, item) => total + item.quantity, 0);
    // Ejemplo: [{ quantity: 2 }, { quantity: 3 }] → 5
  }, [cartItems]);

  // ===== CÁLCULO: PRECIO TOTAL =====
  const totalPrice = useMemo(() => {
    // Suma el precio de cada item multiplicado por su cantidad
    return cartItems.reduce((total, item) => total + item.selectedPrice.price * item.quantity, 0);
    // Ejemplo: [{ price: 10, qty: 2 }, { price: 15, qty: 1 }] → 35
  }, [cartItems]);

  // ===== OPTIMIZACIÓN: VALUE DEL CONTEXTO =====
  // useMemo evita recrear el objeto en cada render (mejora performance)
  // Solo se recrea cuando cambian las dependencias listadas
  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    toggleCart,
    cartCount,
    totalPrice,
    notificationMessage,
    isCartAnimating,
  }), [cartItems, isCartOpen, addToCart, updateQuantity, removeFromCart, clearCart, toggleCart, cartCount, totalPrice, notificationMessage, isCartAnimating]);

  // Provee el contexto a todos los componentes hijos
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ===== HOOK PERSONALIZADO PARA USAR EL CARRITO =====
// Simplifica el uso del contexto en los componentes
export const useCart = () => {
  const context = useContext(CartContext);
  
  // Valida que se esté usando dentro del Provider
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

/* ===== CÓMO SE USA EN OTROS COMPONENTES =====

import { useCart } from '../context/CartContext';

function MiComponente() {
  const { cartItems, addToCart, cartCount } = useCart();
  
  // Ahora puedes usar las funciones y estados del carrito
  return <div>Items en carrito: {cartCount}</div>;
}

*/