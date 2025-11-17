import React from 'react';
import { Link } from 'react-router-dom';

// Interface que define la estructura de cada miga del breadcrumb
interface Crumb {
  label: string; // texto que se muestra como Inicio, Pasteles, Chocolate)
  link?: string; // URL del texto
}

// Componente de breadcrumbs 
// Inicio > Pasteles > Pastel de Chocolate
const Breadcrumbs: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => {
  return (
    // Navegación semántica con aria-label para accesibilidad
    <nav aria-label="breadcrumb" className="container mx-auto px-4 py-3">
      {/* Lista ordenada porque el orden importa en breadcrumbs */}
      <ol className="flex items-center space-x-2 text-sm text-text-secondary">
        {crumbs.map((crumb, index) => {
          // determina si es el último elemento | osea la página actual
          const isLast = index === crumbs.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Si tiene link y NO es el último, renderiza un Link clickeable */}
              {crumb.link && !isLast ? (
                <Link to={crumb.link} className="hover:text-text-primary hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                // si es el último o no tiene link, renderiza solo texto
                <span 
                  className={isLast ? 'font-medium text-text-primary' : ''} // resalta el último
                  aria-current={isLast ? 'page' : undefined} // indica a  cuál es la página actual
                >
                  {crumb.label}
                </span>
              )}
              
              {/* Flecha separadora si no es el ulimo */}
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