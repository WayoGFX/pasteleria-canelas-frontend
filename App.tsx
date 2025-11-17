import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { DataProvider } from './context/DataContext';

// importación de componentes
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

// COMPONENTE SCROLL TO TOP
// hace scroll al inicio de la página
const ScrollToTop = () => {
  const { pathname } = useLocation(); // obtiene la ruta actual | para url y los bread

  useEffect(() => {
    // cada vez que cambia la ruta mueve el scroll al inicio
    window.scrollTo(0, 0);
  }, [pathname]); 

  return null;
};

// COMPONENTE DE NOTIFICACIÓN FLOTANTE
// muestra mensajes al agregar productos al carrito | este estaba antes de las animaciones motion
const Notification: React.FC = () => {
    const { notificationMessage } = useCart(); // obtiene el mensaje del Context
    
    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.18,0.89,0.32,1.28)] ${
            notificationMessage 
                ? 'opacity-100 translate-y-0 scale-100' // visible y animado
                : 'opacity-0 translate-y-4 scale-90 pointer-events-none' // ocultar
        }`}>
            <div className="flex items-center gap-3 rounded-full bg-text-primary px-5 py-3 text-white shadow-lg">
                <span className="material-symbols-outlined">check_circle</span>
                <p className="font-medium text-sm">{notificationMessage}</p>
            </div>
        </div>
    );
};

// PRINCIPAL
const App: React.FC = () => {
  // inicializa AOS | librería que usaba antes
  return (
    // CartProvider da el estado del carrito a todo, así siempre está funcionando
    <CartProvider>
      {/* DataProvider da las categorías y productos de la api */}
      <DataProvider>
        {/*este hace scroll al inicio, para que se vea bonito */}
        <ScrollToTop />
        {/* estructura principal de la app */}
        <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden">
          {/* Header este no se mueve*/}
          <Header />
          
          {/* contenido principal */}
          <main className="flex-grow relative isolate">
            <Routes>
              {/* ruta de inicio */}
              <Route path="/" element={<HomePage />} />
              
              {/* ruta de nsotroos y contacto */}
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              
              {/* rutas dinámicas*/}
              <Route path="/category/:slug" element={<CategoryPage />} /> {/* este es el slug de la categoria */}
              <Route path="/product/:id" element={<ProductDetailPage />} /> {/* este es el slug pero ahi dice id y no lo cambie*/}
              
              {/* editor de pasteles */}
              <Route path="/personalizar" element={<CustomCakePage />} />
              
              {/* login admin*/}
              <Route path="/login" element={<LoginPage />} />
              
              {/* ruta admin con autentificacion */}
              <Route 
                path="/admin/*"
                element={
                  <ProtectedRoute> {/* valida autenticación */}
                    <AdminRouter /> {/* rutas internas, porque no pueden ir publicas */}
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
          
          {/*carrito*/}
          <Cart />
          
          {/* notificación*/}
          <Notification />
        </div>
      </DataProvider>
    </CartProvider>
  );
};

export default App;