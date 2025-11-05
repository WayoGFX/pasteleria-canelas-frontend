// ===== UTILIDADES DE ANIMACIÓN CON FRAMER MOTION =====
// Variantes reutilizables para todo el proyecto

import { Variants } from 'framer-motion';

// ===== ANIMACIONES DE ENTRADA =====

// Fade in desde abajo (para cards, secciones)
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] // ease-out-cubic
    }
  }
};

// Fade in desde la izquierda
export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -40 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Fade in desde la derecha
export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 40 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Fade in simple (para overlays, modales)
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
};

// Scale up (para elementos importantes, CTAs)
export const scaleUp: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// ===== ANIMACIONES PARA LISTAS (STAGGER) =====

// Container que anima sus hijos en secuencia
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms entre cada hijo
      delayChildren: 0.2, // Delay antes del primer hijo
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Item individual (usar con staggerContainer)
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Stagger más rápido (para grids)
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// ===== ANIMACIONES DE INTERACCIÓN =====

// Hover: Elevación suave
export const hoverLift = {
  y: -8,
  transition: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Hover: Scale sutil
export const hoverScale = {
  scale: 1.03,
  transition: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Tap: Feedback al hacer clic
export const tapScale = {
  scale: 0.97
};

// ===== ANIMACIONES PARA CARRUSELES =====

// Slide in desde la derecha (para items del carrusel)
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

// ===== ANIMACIONES PARA HERO =====

// Hero title con efecto dramático
export const heroTitle: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Hero subtitle con delay
export const heroSubtitle: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// Hero CTA button
export const heroCTA: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.6,
      ease: [0.34, 1.56, 0.64, 1] // spring effect
    }
  }
};

// ===== CONFIGURACIÓN DE VIEWPORT =====
// Reutilizable para whileInView

export const viewportConfig = {
  once: true, // Solo anima una vez
  margin: "-100px", // Empieza la animación 100px antes
  amount: 0.3 // Activa cuando 30% del elemento es visible
};

export const viewportConfigEarly = {
  once: true,
  margin: "-50px", // Empieza antes
  amount: 0.2
};

// ===== TRANSICIONES PERSONALIZADAS =====

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const smoothTransition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1]
};