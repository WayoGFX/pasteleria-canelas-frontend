// Busca productos en memoria
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_NUMBER, BUSINESS_NAME } from '../constants';
import { useCart } from '../context/CartContext';
import { Product, ProductPrice, Category } from '../types';
import { useData } from '../context/DataContext';
import Breadcrumbs from './Breadcrumbs';

//  variantes de animación
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  viewportConfig,
  scaleUp
} from '../utils/animations';

// COMPONENTE
const FeatureIcon: React.FC<{ icon: string; text: string; delay?: number }> = ({ icon, text, delay = 0 }) => (
    <motion.div 
      className="flex items-center gap-3 bg-primary/80 p-3 rounded-lg border border-gray-200/50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
    >
        <span className="material-symbols-outlined text-secondary text-3xl">{icon}</span>
        <div>
            <p className="font-semibold text-sm text-text-primary">{text}</p>
        </div>
    </motion.div>
);

const ProductDetailPage: React.FC = () => {
  // ESTADOS | el id es el slug
  const { id: slug } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  // obtener datos desde el contexto 
  const { categories, allProducts, loading: loadingCatalog } = useData();

  // buscar producto en memoria
  const product = useMemo(
    () => allProducts.find(p => p.id === slug) || null,
    [allProducts, slug]
  );

  // buscar categoría en memoria 
  const category = useMemo(
    () => product ? categories.find(c => c.slug === product.category) || null : null,
    [categories, product]
  );

  // productos relacionados filtrados en memoria
  const relatedProducts = useMemo(
    () => {
      if (!product || !category) return [];
      return allProducts
        .filter(p => p.category === category.slug && p.id !== slug)
        .slice(0, 4);
    },
    [allProducts, product, category, slug]
  );

  // estados locales del componente
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isAdded, setIsAdded] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Seleccionar primer precio cuando el producto carga
  useEffect(() => {
    if (product && product.prices && product.prices.length > 0) {
      setSelectedPrice(product.prices[0]);
    } else {
      setSelectedPrice(undefined);
    }
  }, [product]);

  // FUNCIONES
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePosition({ x, y });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2500);
    });
  };

  // SKELETON LOADING
  if (loadingCatalog) {
    return (
      <motion.div 
        className="container mx-auto pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Skeleton */}
        <motion.div 
          className="h-6 bg-gray-200 rounded w-1/4 mb-6 ml-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        
        {/* Grid skeleton */}
        <div className="sm:grid sm:grid-cols-2 sm:gap-10 sm:py-6 sm:max-w-5xl sm:mx-auto sm:items-start">
            <motion.div 
              className="aspect-square w-full bg-gray-200 sm:rounded-3xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            
            <div className="space-y-6 p-4 sm:p-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-12 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                  />
                ))}
            </div>
        </div>
      </motion.div>
    );
  }

  // ERROR 404
  if (!product || !category) {
    return (
      <motion.div 
        className="text-center py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.span 
          className="material-symbols-outlined text-6xl text-text-secondary mb-4 block"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring" }}
        >
          search_off
        </motion.span>
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <Link to="/" className="text-accent hover:underline mt-4 inline-block">Volver al inicio</Link>
      </motion.div>
    );
  }
  
  // DATOS
  const crumbs = [
    { label: 'Inicio', link: '/' },
    ...(category.slug ? [{ label: category.name, link: `/category/${category.slug}` }] : []),
    { label: product.name }
  ];

  const isCustomCake = product.category === 'personalizados';
  const hasPrices = product.prices && product.prices.length > 0;
  const currentUrl = window.location.href;

  const handleAddToCart = () => {
    if (isCustomCake || !selectedPrice || isAdded) return;
    addToCart(product, selectedPrice, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const generateWhatsAppMessage = (messageTemplate: string) => {
    const encodedMessage = encodeURIComponent(messageTemplate);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };
  
  const shareText = `¡Mira este increíble ${product.name} de ${BUSINESS_NAME}!`;

  // PRINCIPAL DISEÑO
  return (
    <motion.div 
      className="container mx-auto pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
        <Breadcrumbs crumbs={crumbs} />
        
        {/* Grid 2 columnas */}
        <div className="sm:grid sm:grid-cols-2 sm:gap-10 sm:py-6 sm:max-w-5xl sm:mx-auto sm:items-start">
            
            {/* COLUMNA IMAGEN CON ZOOM */}
            <motion.div 
                className="relative sm:col-span-1 flex items-center justify-center"
                variants={fadeInRight}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                  className="aspect-square w-full sm:rounded-3xl overflow-hidden sm:shadow-2xl cursor-zoom-in relative"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsZooming(true)}
                  onMouseLeave={() => {
                    setIsZooming(false);
                    setMousePosition({ x: 50, y: 50 });
                  }}
                  whileHover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
                >
                    <motion.img 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                      src={product.image} 
                      loading="lazy" 
                      animate={{
                        scale: isZooming ? 1.75 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                      }}
                    />
                    
                    {/* indicador de zoom */}
                    <AnimatePresence>
                      {!isZooming && (
                        <motion.div
                          className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <span className="material-symbols-outlined text-sm">zoom_in</span>
                          <span>Hover para zoom</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
            
            {/* COLUMNA DETALLES */}
            <div className="space-y-6 p-4 sm:p-0">
                
                {/* encabezado */}
                <motion.div
                  variants={fadeInLeft}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                >
                     <div className="flex justify-between items-start">
                        {category.slug ? (
                            <Link to={`/category/${product.category}`} className="text-sm text-text-secondary hover:text-text-primary capitalize hover:underline">
                              {category.name}
                            </Link>
                        ) : (
                            <span className="text-sm text-text-secondary capitalize">{category.name || 'Sin categoría'}</span>
                        )}
                        
                        {product.featured && (
                            <motion.span 
                              className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-secondary"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            >
                                <span className="material-symbols-outlined text-sm">star</span>
                                Más Vendido
                            </motion.span>
                        )}
                     </div>
                    
                    <motion.h1 
                      className="text-4xl sm:text-5xl font-bold tracking-tight font-serif-display mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {product.name}
                    </motion.h1>
                    
                    <motion.p 
                      className="mt-4 text-base sm:text-lg text-text-secondary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {product.description}
                    </motion.p>
                </motion.div>
                
                {/* detalles dependiendo su categoría */}
                <motion.div 
                  className="grid grid-cols-2 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                    <FeatureIcon icon="bakery_dining" text="Horneado Artesanal" delay={0.5} />
                    <FeatureIcon icon="eco" text="Ingredientes Frescos" delay={0.6} />
                    {product.category === 'pasteles' && <FeatureIcon icon="cake" text="Ideal para Celebrar" delay={0.7} />}
                    {product.category === 'panaderia' && <FeatureIcon icon="breakfast_dining" text="Perfecto para el Desayuno" delay={0.7} />}
                </motion.div>

                {/* selector de tamaño y precio */}
                {hasPrices && !isCustomCake && (
                    <>
                        {product.prices.length > 1 && (
                             <motion.div
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: 0.5 }}
                             >
                                <h3 className="text-xl font-bold leading-6 mb-2">Tamaño</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.prices.map((priceOption, index) => (
                                        <motion.label 
                                            key={priceOption.size} 
                                            className={`relative flex cursor-pointer items-center justify-center rounded-xl border-2 p-3 text-center font-medium ${
                                                selectedPrice?.size === priceOption.size 
                                                    ? 'border-secondary bg-secondary/10' 
                                                    : 'border-gray-200'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.6 + index * 0.05 }}
                                        >
                                            <input
                                                type="radio"
                                                name="size-choice"
                                                value={priceOption.size}
                                                checked={selectedPrice?.size === priceOption.size}
                                                onChange={() => setSelectedPrice(priceOption)}
                                                className="sr-only"
                                            />
                                            <span className="text-md font-semibold">{priceOption.size}</span>
                                        </motion.label>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        
                        {/* precio y cantidad */}
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                            <motion.p 
                              className="text-3xl font-bold text-secondary"
                              key={selectedPrice?.size}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              ${selectedPrice?.price.toFixed(2)}
                            </motion.p>
                            
                            {/* control de cantidad */}
                            <div className="flex items-center gap-2 rounded-full p-1 bg-gray-100">
                                <motion.button 
                                    onClick={() => setQuantity(q => Math.max(1, q-1))} 
                                    aria-label="Reducir cantidad" 
                                    className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-text-primary shadow-sm text-xl font-bold"
                                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    -
                                </motion.button>
                                
                                <motion.span 
                                  className="font-bold text-lg w-8 text-center"
                                  key={quantity}
                                  initial={{ scale: 1.2 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring" }}
                                >
                                  {quantity}
                                </motion.span>
                                
                                <motion.button 
                                    onClick={() => setQuantity(q => q+1)} 
                                    aria-label="Aumentar cantidad" 
                                    className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-text-primary shadow-sm text-xl font-bold"
                                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    +
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
                
                {/* botones de acción */}
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {isCustomCake ? (
                     <div className='space-y-3'>
                        <p className="text-center text-sm text-text-secondary">
                          Este es un pastel de ejemplo. Puedes cotizar uno similar o crear el tuyo desde cero.
                        </p>
                        
                        <motion.button 
                            onClick={() => generateWhatsAppMessage(`¡Hola ${BUSINESS_NAME}! Me gustaría cotizar un pastel como el de "${product.name}".\n\n¡Quedo a la espera de más información, muchas gracias!`)} 
                            className="bg-[#25D366] text-white flex w-full items-center justify-center gap-2 rounded-full py-4 px-5 text-base font-bold shadow-lg"
                            whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(37, 211, 102, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2.001c-5.503 0-9.972 4.47-9.972 9.971 0 1.761.46 3.486 1.34 4.978l-1.39 5.093 5.215-1.373c1.472.82 3.12 1.258 4.807 1.258h.001c5.502 0 9.971-4.47 9.971-9.971s-4.469-9.97-9.971-9.97zm0 17.94c-1.574 0-3.11-.472-4.43-1.365l-.316-.187-3.268.861.87-3.197-.206-.328c-.985-1.564-1.503-3.411-1.503-5.328 0-4.596 3.737-8.332 8.332-8.332 4.594 0 8.33 3.736 8.33 8.332s-3.736 8.332-8.33 8.332zm3.32-5.463c-.183-.3-.642-.48-1.353-.807-.71-.326-4.2-2.053-4.858-2.288-.658-.234-1.135-.125-1.135.597 0 .346.402.597.55.777.149.179.317.402.485.617.168.215.337.234.622.062.285-.172.932-.341 1.777-1.09.845-.75 1.408-1.51 1.576-1.761.168-.25.168-.465.077-.617-.091-.151-.234-.366-.485-.617s-.418-.47-.622-.705c-.204-.234-.234-.191-.403-.465s-.34-.597-.465-.847c-.125-.25-.25-.213-.34-.213h-.452c-.172 0-.465.062-.71.303-.246.242-.932.912-.932 2.228 0 1.316.95 2.57 1.08 2.75.129.179 1.8 2.768 4.31 3.841 2.512 1.072 2.512.715 2.797.668.285-.047.933-.38 1.062-.75.129-.37.129-.687.091-.75s-.148-.094-.337-.187z"/></svg>
                            <span>Cotizar este diseño</span>
                        </motion.button>
                        
                         <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                           <Link to="/personalizar" className="border-2 border-secondary text-secondary flex w-full items-center justify-center gap-2 rounded-full py-4 px-5 text-base font-bold shadow-lg">
                              <span className="material-symbols-outlined">edit_cake</span>
                              <span>Crear mi propio pastel</span>
                          </Link>
                         </motion.div>
                     </div>
                  ) : hasPrices ? (
                    <motion.button 
                        onClick={handleAddToCart} 
                        disabled={isAdded}
                        className={`text-white flex w-full items-center justify-center gap-2 rounded-full py-4 px-5 text-base font-bold shadow-lg transition-colors ${
                            isAdded ? 'bg-green-500' : 'bg-secondary'
                        }`}
                        whileHover={!isAdded ? { y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" } : {}}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* animación del ícono*/}
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={isAdded ? 'check_circle' : 'add_shopping_cart'}
                            className="material-symbols-outlined"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            {isAdded ? 'check_circle' : 'add_shopping_cart'}
                          </motion.span>
                        </AnimatePresence>
                        
                        {/* animación del texto */}
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={isAdded ? 'added' : 'add'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isAdded ? '¡Añadido!' : 'Añadir al carrito'}
                          </motion.span>
                        </AnimatePresence>
                    </motion.button>
                  ) : (
                    <div className="text-center p-4 rounded-xl bg-gray-100 border border-gray-200 space-y-3">
                         <p className="font-semibold text-md text-text-primary">Producto para cotización</p>
                         <p className="text-sm text-text-secondary">Este producto no está disponible para compra directa. Contáctanos para más información.</p>
                         
                         <motion.button 
                            onClick={() => generateWhatsAppMessage(`¡Hola ${BUSINESS_NAME}! Quisiera más información sobre el producto "${product.name}".`)} 
                            className="bg-[#25D366] text-white flex w-full items-center justify-center gap-2 rounded-full py-3 px-4 text-sm font-bold shadow-lg"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                         >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 2.001c-5.503 0-9.972 4.47-9.972 9.971 0 1.761.46 3.486 1.34 4.978l-1.39 5.093 5.215-1.373c1.472.82 3.12 1.258 4.807 1.258h.001c5.502 0 9.971-4.47 9.971-9.971s-4.469-9.97-9.971-9.97zm0 17.94c-1.574 0-3.11-.472-4.43-1.365l-.316-.187-3.268.861.87-3.197-.206-.328c-.985-1.564-1.503-3.411-1.503-5.328 0-4.596 3.737-8.332 8.332-8.332 4.594 0 8.33 3.736 8.33 8.332s-3.736 8.332-8.33 8.332zm3.32-5.463c-.183-.3-.642-.48-1.353-.807-.71-.326-4.2-2.053-4.858-2.288-.658-.234-1.135-.125-1.135.597 0 .346.402.597.55.777.149.179.317.402.485.617.168.215.337.234.622.062.285-.172.932-.341 1.777-1.09.845-.75 1.408-1.51 1.576-1.761.168-.25.168-.465.077-.617-.091-.151-.234-.366-.485-.617s-.418-.47-.622-.705c-.204-.234-.234-.191-.403-.465s-.34-.597-.465-.847c-.125-.25-.25-.213-.34-.213h-.452c-.172 0-.465.062-.71.303-.246.242-.932.912-.932 2.228 0 1.316.95 2.57 1.08 2.75.129.179 1.8 2.768 4.31 3.841 2.512 1.072 2.512.715 2.797.668.285-.047.933-.38 1.062-.75.129-.37.129-.687.091-.75s-.148-.094-.337-.187z"/></svg>
                            <span>Consultar</span>
                         </motion.button>
                    </div>
                  )}
                </motion.div>

                {/* compartir */}
                <motion.div 
                  className="mt-8 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                    <h3 className="text-md font-bold text-text-primary mb-3">Compartir este producto</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                        {[
                          { href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`, label: "WhatsApp", icon: "M12.031 2.001c-5.503 0-9.972 4.47-9.972 9.971 0 1.761.46 3.486 1.34 4.978l-1.39 5.093 5.215-1.373c1.472.82 3.12 1.258 4.807 1.258h.001c5.502 0 9.971-4.47 9.971-9.971s-4.469-9.97-9.971-9.97zm0 17.94c-1.574 0-3.11-.472-4.43-1.365l-.316-.187-3.268.861.87-3.197-.206-.328c-.985-1.564-1.503-3.411-1.503-5.328 0-4.596 3.737-8.332 8.332-8.332 4.594 0 8.33 3.736 8.33 8.332s-3.736 8.332-8.33 8.332zm3.32-5.463c-.183-.3-.642-.48-1.353-.807-.71-.326-4.2-2.053-4.858-2.288-.658-.234-1.135-.125-1.135.597 0 .346.402.597.55.777.149.179.317.402.485.617.168.215.337.234.622.062.285-.172.932-.341 1.777-1.09.845-.75 1.408-1.51 1.576-1.761.168-.25.168-.465.077-.617-.091-.151-.234-.366-.485-.617s-.418-.47-.622-.705c-.204-.234-.234-.191-.403-.465s-.34-.597-.465-.847c-.125-.25-.25-.213-.34-.213h-.452c-.172 0-.465.062-.71.303-.246.242-.932.912-.932 2.228 0 1.316.95 2.57 1.08 2.75.129.179 1.8 2.768 4.31 3.841 2.512 1.072 2.512.715 2.797.668.285-.047.933-.38 1.062-.75.129-.37.129-.687.091-.75s-.148-.094-.337-.187z" },
                          { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, label: "Facebook", icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                          { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`, label: "X/Twitter", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }
                        ].map((social, index) => (
                          <motion.a 
                            key={social.label}
                            href={social.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label={`Compartir en ${social.label}`} 
                            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-text-secondary"
                            whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + index * 0.05 }}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}/></svg>
                          </motion.a>
                        ))}
                        
                        {/* copiar enlace funcion */}
                        <motion.button 
                            onClick={handleCopyLink} 
                            className={`flex items-center gap-2 rounded-full py-2 px-4 text-sm font-medium border-2 ${
                                isLinkCopied 
                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                    : 'bg-gray-100 text-text-secondary border-gray-100'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <AnimatePresence mode="wait">
                              <motion.span 
                                key={isLinkCopied ? 'copied' : 'copy'}
                                className="material-symbols-outlined text-lg"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                              >
                                {isLinkCopied ? 'check' : 'link'}
                              </motion.span>
                            </AnimatePresence>
                            <span>{isLinkCopied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
                        </motion.button>
                    </div>
                </motion.div>

            </div>
        </div>
        
        {/* PRODUCTOS RELACIONADOS */}
        {relatedProducts.length > 0 && (
            <motion.section 
              className="px-4 py-8 mt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
            >
                <motion.h2 
                  className="text-3xl font-bold text-center mb-6 font-serif-display"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportConfig}
                >
                  También te podría gustar
                </motion.h2>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportConfig}
                >
                    {relatedProducts.map((related) => (
                        <motion.div
                          key={related.id}
                          variants={staggerItem}
                        >
                          <Link to={`/product/${related.id}`} className="group block">
                             <motion.div 
                               className="w-full aspect-square rounded-2xl overflow-hidden shadow-md"
                               whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
                             >
                                <motion.img 
                                    src={related.image} 
                                    alt={related.name} 
                                    loading="lazy" 
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                />
                             </motion.div>
                             
                             <h3 className="font-bold mt-2">{related.name}</h3>
                             <p className="text-sm font-bold text-secondary">
                                {related.category === 'personalizados' 
                                    ? 'Personalizable' 
                                    : (related.prices?.[0] 
                                        ? `$${related.prices[0].price.toFixed(2)}${related.prices.length > 1 ? ' (desde)' : ''}`
                                        : 'Consultar precio')
                                }
                            </p>
                          </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        )}
    </motion.div>
  );
};

export default ProductDetailPage;