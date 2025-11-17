import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { CartItem, Product, ProductPrice } from '../types';

// DEFINICIÓN DEL CONTEXTO
// interface que define todas las funciones y estados disponibles para los componentes que usen el carrito
interface CartContextType {
  cartItems: CartItem[]; // array de productos en el carrito
  addToCart: (product: Product, selectedPrice: ProductPrice, quantity: number) => void; // agregar producto
  updateQuantity: (itemId: string, newQuantity: number) => void; // cambiar cantidad de un item
  removeFromCart: (itemId: string) => void; // eliminar un item
  clearCart: () => void; // vaciar todo el carrito
  isCartOpen: boolean; // estado del sidebar del carrito abierto/cerrado
  toggleCart: () => void; // Abrir/cerrar el carrito
  cartCount: number; // cantidad total de productos | suma de cantidades
  totalPrice: number; // precio total del carrito
  notificationMessage: string; // mensaje de notificación de Producto añadido
  isCartAnimating: boolean; // estado para animación del ícono del carrito
}

// crea el contexto  inicialmente undefined, se llena en el Provider
const CartContext = createContext<CartContextType | undefined>(undefined);

// PROVIDER COMPONENTE Y PROVEE EL CARRITO
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // estado principal array de items en el carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // estado del sidebar abierto/cerrado
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // mensaje de notificación temporal
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // estado para animar el ícono del carrito cuando se agrega algo
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // FUNCIÓN AGREGAR AL CARRITO
  // useCallback evita recrear la función en cada render
  const addToCart = useCallback((product: Product, selectedPrice: ProductPrice, quantity: number) => {
    setCartItems(prevItems => {
      // genera un ID único combinando el ID del producto y el tamaño
      // Ejemplo: "pastel-chocolate-mediano" > esto hace tener el mismo producto pero en diferentes tamaños
      const itemId = `${product.id}-${selectedPrice.size}`;
      
      // busca si el item ya existe en el carrito
      const existingItem = prevItems.find(item => item.id === itemId);

      if (existingItem) {
        // si ya existe solo incrementa la cantidad
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // si no existe agrega el nuevo item al array
        return [...prevItems, { 
            id: itemId, 
            name: product.name, 
            image: product.image,
            quantity, 
            selectedPrice 
        }];
      }
    });
    
    // muestra notificación temporal
    setNotificationMessage(`${quantity} x ${product.name} añadido al carrito`);
    
    // activa la animación del ícono del carrito
    setIsCartAnimating(true);
    
    // limpia la notificación después de 3 segundos
    setTimeout(() => {
        setNotificationMessage('');
    }, 3000);
    
    // desactiva la animación después de 600ms | la del carrito
    setTimeout(() => {
        setIsCartAnimating(false);
    }, 600);
  }, []); // [] = no depende de ninguna variable externa nunca se recrea

  // FUNCIÓN DE ACTUALIZAR CANTIDAD
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0) // si la cantidad llega a 0 elimina el item
    );
  }, []);

  // FUNCIÓN DE ELIMINAR DEL CARRITO
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  // FUNCIÓN DE VACIAR CARRITO
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // FUNCIÓN DE ABRIR/CERRAR CARRITO
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev); // invierte el estado actual para cerrarlo
  }, []);

  // CANTIDAD TOTAL DE PRODUCTOS
  // useMemo evita recalcular en cada render, solo cuando cambia cartItems
  const cartCount = useMemo(() => {
    // suma todas las cantidades de todos los items
    return cartItems.reduce((total, item) => total + item.quantity, 0);
    // queda como [{ quantity: 2 }, { quantity: 3 }] = 5
  }, [cartItems]);

  // PRECIO TOTAL
  const totalPrice = useMemo(() => {
    // suma el precio de cada item multiplicado por su cantidad
    return cartItems.reduce((total, item) => total + item.selectedPrice.price * item.quantity, 0);
    // queda como [{ price: 10, qty: 2 }, { price: 15, qty: 1 }] = 35
  }, [cartItems]);

  // VALUE DEL CONTEXTO
  // useMemo evita recrear el objeto en cada render
  // solo se recrea cuando cambian las dependencias listadas
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

  // provee el contexto a todos los componentes hijos
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// HOOK PERSONALIZADO PARA USAR EL CARRITO
// simplifica el uso del contexto en los componentes
export const useCart = () => {
  const context = useContext(CartContext);
  
  // valida que se esté usando dentro del Provider
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

/*

import { useCart } from '../context/CartContext';

function MiComponente() {
  const { cartItems, addToCart, cartCount } = useCart();
  
  // estados del carrito
  return <div>Items en carrito: {cartCount}</div>;
}

*/