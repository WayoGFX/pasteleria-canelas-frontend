import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ===== VARIANTES DE ANIMACIÓN =====
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

const errorVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simula un pequeño delay para mejor UX
        setTimeout(() => {
            const success = login(username, password);
            if (!success) {
                setError('Usuario o contraseña incorrectos.');
                setIsLoading(false);
            }
            // Si success = true, el useEffect redirige automáticamente
        }, 500);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-primary via-white to-accent/10 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-md w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Card principal */}
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100">
                    
                    {/* Header con ícono */}
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {/* Ícono de admin */}
                        <motion.div 
                            className="mx-auto h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="material-symbols-outlined text-4xl text-secondary">
                                admin_panel_settings
                            </span>
                        </motion.div>
                        
                        <h2 className="text-3xl font-extrabold text-text-primary font-serif-display">
                            Acceso de Administrador
                        </h2>
                        <p className="mt-2 text-sm text-text-secondary">
                            Ingresa tus credenciales para continuar
                        </p>
                    </motion.div>

                    {/* Formulario */}
                    <motion.form 
                        className="mt-8 space-y-5"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {/* Campo Usuario */}
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-text-primary mb-2"
                            >
                                Usuario
                            </label>
                            <motion.input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                placeholder="admin"
                                variants={inputVariants}
                                whileFocus="focus"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Campo Contraseña */}
                        <div>
                            <label 
                                htmlFor="password-input" 
                                className="block text-sm font-medium text-text-primary mb-2"
                            >
                                Contraseña
                            </label>
                            <motion.input
                                id="password-input"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                variants={inputVariants}
                                whileFocus="focus"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Mensaje de error */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                                    variants={errorVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Botón de submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className={`relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white shadow-lg transition-all ${
                                isLoading 
                                    ? 'bg-secondary/70 cursor-not-allowed' 
                                    : 'bg-secondary hover:bg-secondary/90'
                            }`}
                            whileHover={!isLoading ? { y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading ? (
                                <>
                                    <motion.span
                                        className="material-symbols-outlined"
                                        animate={{ rotate: 360 }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            duration: 1, 
                                            ease: "linear" 
                                        }}
                                    >
                                        progress_activity
                                    </motion.span>
                                    <span>Verificando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">login</span>
                                    <span>Entrar</span>
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Footer con info */}
                    <motion.div 
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-xs text-text-secondary">
                            ¿Olvidaste tu contraseña? Contacta al administrador del sistema.
                        </p>
                    </motion.div>
                </div>

                {/* Decoración de fondo */}
                <motion.div
                    className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;

/* ===== MEJORAS IMPLEMENTADAS =====

✅ DISEÑO:
- Card con sombra 2xl y bordes redondeados
- Gradiente de fondo sutil
- Ícono de admin con badge circular
- Labels visibles (mejor UX)
- Inputs con esquinas redondeadas
- Error con ícono y mejor diseño

✅ ANIMACIONES:
- Card aparece con fade + scale
- Header con slide down
- Form con fade in
- Inputs con scale sutil en focus
- Error con spring animation
- Botón con hover elevation
- Loading con spinner rotatorio

✅ ESTADOS:
- Loading state con spinner
- Disabled inputs durante loading
- Botón cambia color cuando loading
- Error con AnimatePresence

✅ UX:
- Delay de 500ms para simular auth real
- Feedback visual claro en cada acción
- Placeholder mejorados
- Mensaje de ayuda en footer
- Decoración de fondo sutil

✅ ACCESIBILIDAD:
- Labels visibles (no solo sr-only)
- Colores con buen contraste
- Estados disabled claros
- Focus states definidos

===== CREDENCIALES POR DEFECTO =====

Usuario: admin
Contraseña: (definido en AuthContext)

*/