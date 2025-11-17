// UTILIDADES DE ANIMACIÓN CON FRAMER MOTION 
// Variantes reutilizables 
import { Variants } from 'framer-motion';

// ANIMACIONES DE ENTRADA

// Fade in desde abajo
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
      ease: [0.25, 0.1, 0.25, 1]
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

// Fade in simple 
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

// Scale up 
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

// ANIMACIONES PARA LISTAS STAGGER

// Container que anima sus hijos en secuencia
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// item individual 
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

// Stagger más rápido para grids
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

// ANIMACIONES DE INTERACCIÓN

// Hover elevación suave
export const hoverLift = {
  y: -8,
  transition: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Hover scale
export const hoverScale = {
  scale: 1.03,
  transition: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

// Tap Feedback al hacer clic
export const tapScale = {
  scale: 0.97
};

// ANIMACIONES PARA CARRUSELES

// slide in desde la derecha para items del carrusel
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

// ANIMACIONES PARA HERO

// hero title con efecto
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

// Hero cta
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
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

//  CONFIGURACIÓN DE VIEWPORT 
export const viewportConfig = {
  once: true,
  margin: "-100px", 
  amount: 0.3 
};

export const viewportConfigEarly = {
  once: true,
  margin: "-50px",
  amount: 0.2
};

// TRANSICIONES PERSONALIZADAS

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export const smoothTransition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1]
};