import React, { useState } from 'react';

// ===== COMPONENTE REUTILIZABLE: PREVIEW DE IMAGEN =====
// Muestra una vista previa de la imagen ingresada en el formulario
// Maneja errores de carga y muestra placeholder si falla

interface ImagePreviewProps {
  imageUrl: string; // URL de la imagen a previsualizar
  alt?: string; // Texto alternativo (opcional)
  className?: string; // Clases adicionales (opcional)
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageUrl, 
  alt = 'Vista previa', 
  className = '' 
}) => {
  // Estado para manejar errores de carga
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Si no hay URL, no mostrar nada
  if (!imageUrl || imageUrl.trim() === '') {
    return null;
  }

  // Si hubo error al cargar, mostrar placeholder
  if (hasError) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-4xl text-gray-400">broken_image</span>
          <p className="text-sm text-gray-500 mt-2">Error al cargar imagen</p>
          <p className="text-xs text-gray-400">Verifica la URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton mientras carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-gray-400">image</span>
        </div>
      )}
      
      {/* Imagen real */}
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default ImagePreview;