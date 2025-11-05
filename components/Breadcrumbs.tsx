import React from 'react';
import { Link } from 'react-router-dom';

// Interface que define la estructura de cada "miga" del breadcrumb
interface Crumb {
  label: string; // Texto que se muestra (ej: "Inicio", "Pasteles", "Chocolate")
  link?: string; // URL opcional (si no tiene link, es solo texto - generalmente el último item)
}

// Componente de breadcrumbs (migajas de pan) para navegación
// Ejemplo visual: Inicio > Pasteles > Pastel de Chocolate
const Breadcrumbs: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => {
  return (
    // Navegación semántica con aria-label para accesibilidad
    <nav aria-label="breadcrumb" className="container mx-auto px-4 py-3">
      {/* Lista ordenada (ol) porque el orden importa en breadcrumbs */}
      <ol className="flex items-center space-x-2 text-sm text-text-secondary">
        {crumbs.map((crumb, index) => {
          // Determina si es el último elemento (página actual)
          const isLast = index === crumbs.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Si tiene link Y NO es el último, renderiza un Link clickeable */}
              {crumb.link && !isLast ? (
                <Link to={crumb.link} className="hover:text-text-primary hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                // Si es el último o no tiene link, renderiza solo texto
                <span 
                  className={isLast ? 'font-medium text-text-primary' : ''} // Resalta el último
                  aria-current={isLast ? 'page' : undefined} // Indica a screen readers cuál es la página actual
                >
                  {crumb.label}
                </span>
              )}
              
              {/* Flecha separadora (solo si NO es el último) */}
              {!isLast && (
                <span className="material-symbols-outlined text-lg leading-none">chevron_right</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

/* ===== EJEMPLO DE USO =====

// En CategoryPage.tsx:
const crumbs = [
  { label: 'Inicio', link: '/' },
  { label: 'Pasteles' } // Sin link porque es la página actual
];

<Breadcrumbs crumbs={crumbs} />
// Resultado: Inicio > Pasteles

// En ProductDetailPage.tsx:
const crumbs = [
  { label: 'Inicio', link: '/' },
  { label: 'Pasteles', link: '/category/pasteles' },
  { label: 'Pastel de Chocolate' } // Página actual
];

<Breadcrumbs crumbs={crumbs} />
// Resultado: Inicio > Pasteles > Pastel de Chocolate

*/