import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { DataProvider } from './context/DataContext';

// Importación de componentes
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProductDetailPage from './components/ProductDetailPage';
import CustomCakePage from './components/CustomCakePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import AdminRouter from './components/admin/AdminRouter';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Declaración de tipo para TypeScript

// ===== COMPONENTE: SCROLL TO TOP =====
// Hace scroll al inicio de la página cada vez que cambias de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation(); // Obtiene la ruta actual

  useEffect(() => {
    // Cada vez que cambia la ruta, mueve el scroll al inicio
    window.scrollTo(0, 0);
  }, [pathname]); // Se ejecuta cuando pathname cambia

  return null; // No renderiza nada, solo efecto secundario
};

// ===== COMPONENTE: NOTIFICACIÓN FLOTANTE =====
// Muestra mensajes temporales cuando agregas productos al carrito
const Notification: React.FC = () => {
    const { notificationMessage } = useCart(); // Obtiene el mensaje del Context
    
    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.18,0.89,0.32,1.28)] ${
            notificationMessage 
                ? 'opacity-100 translate-y-0 scale-100' // Visible y animado
                : 'opacity-0 translate-y-4 scale-90 pointer-events-none' // Oculto
        }`}>
            <div className="flex items-center gap-3 rounded-full bg-text-primary px-5 py-3 text-white shadow-lg">
                <span className="material-symbols-outlined">check_circle</span>
                <p className="font-medium text-sm">{notificationMessage}</p>
            </div>
        </div>
    );
};

// ===== COMPONENTE PRINCIPAL: APP =====
const App: React.FC = () => {
  // Inicializa AOS (animaciones on scroll) al montar el componente
  return (
    // ===== PROVIDERS: ENVUELVEN TODA LA APP =====
    // CartProvider: Provee el estado del carrito a toda la app
    <CartProvider>
      {/* DataProvider: Provee categorías y productos desde la API */}
      <DataProvider>
        {/* Componente que hace scroll al inicio en cada cambio de ruta */}
        <ScrollToTop />
        
        {/* Estructura principal de la app */}
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden">
          
          {/* Header fijo en la parte superior */}
          <Header />
          
          {/* Contenido principal (flex-grow para ocupar todo el espacio disponible) */}
          <main className="flex-grow relative isolate">
            {/* ===== DEFINICIÓN DE RUTAS ===== */}
            <Routes>
              {/* Ruta principal (home) */}
              <Route path="/" element={<HomePage />} />
              
              {/* Páginas estáticas */}
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              
              {/* Rutas dinámicas con parámetros */}
              <Route path="/category/:slug" element={<CategoryPage />} /> {/* :slug es un parámetro variable */}
              <Route path="/product/:id" element={<ProductDetailPage />} /> {/* :id es el slug del producto */}
              
              {/* Editor de pasteles personalizados */}
              <Route path="/personalizar" element={<CustomCakePage />} />
              
              {/* Login para admin */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rutas del panel admin (protegidas con autenticación) */}
              <Route 
                path="/admin/*" // /* = cualquier sub-ruta dentro de /admin
                element={
                  <ProtectedRoute> {/* Componente que valida autenticación */}
                    <AdminRouter /> {/* Router interno del admin */}
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Footer en la parte inferior */}
          <Footer />
          
          {/* Sidebar del carrito (se muestra/oculta con toggleCart) */}
          <Cart />
          
          {/* Notificación flotante */}
          <Notification />
        </div>
      </DataProvider>
    </CartProvider>
  );
};

export default App;

/* ===== ARQUITECTURA DE LA APP =====

JERARQUÍA DE COMPONENTES:
App
├── CartProvider (estado global del carrito)
│   └── DataProvider (estado global de categorías/productos)
│       ├── ScrollToTop (utilidad)
│       ├── Header (navegación superior)
│       ├── main (contenido principal)
│       │   └── Routes (sistema de rutas)
│       │       ├── HomePage
│       │       ├── CategoryPage
│       │       ├── ProductDetailPage
│       │       ├── CustomCakePage (editor de pasteles)
│       │       └── AdminRouter (panel admin protegido)
│       ├── Footer (pie de página)
│       ├── Cart (sidebar del carrito)
│       └── Notification (toast de notificaciones)

FLUJO DE DATOS:
1. DataProvider carga categorías y productos desde la API de C#
2. Los componentes consumen estos datos usando useData()
3. CartProvider maneja el estado del carrito
4. Los componentes agregan/eliminan productos usando useCart()
5. Las rutas dinámicas usan parámetros (slug, id) para mostrar contenido específico

*/