// components/admin/IconPicker.tsx
// PROPÓSITO: Selector de íconos Material Symbols con preview y sugerencias
import React, { useState } from 'react';

// TIPOS
interface IconPickerProps {
    //Valor actual del ícono nombre del Material Symbol
    value: string;
    // actualizar valor
    onChange: (iconName: string) => void;
    // id del input
    id?: string;
    // nombre del input para formularios
    name?: string;
}
// ÍCONOS SUGERIDOS PARA PASTELERÍA
const POPULAR_ICONS = [
    // Pasteles y postres
    { name: 'cake', label: 'Pastel', category: 'Dulces' },
    { name: 'bakery_dining', label: 'Panadería', category: 'Dulces' },
    { name: 'cookie', label: 'Galleta', category: 'Dulces' },
    { name: 'icecream', label: 'Helado', category: 'Dulces' },
    { name: 'fastfood', label: 'Comida rápida', category: 'Dulces' },
    
    // Bebidas
    { name: 'coffee', label: 'Café', category: 'Bebidas' },
    { name: 'local_cafe', label: 'Café (taza)', category: 'Bebidas' },
    { name: 'Fork_Spoon', label: 'Comida', category: 'General' },
    { name: 'wine_bar', label: 'Bebida', category: 'Bebidas' },
    { name: 'local_bar', label: 'Bar', category: 'Bebidas' },
    
    // Celebraciones
    { name: 'celebration', label: 'Celebración', category: 'Eventos' },
    { name: 'party_mode', label: 'Fiesta', category: 'Eventos' },
    { name: 'redeem', label: 'Regalo', category: 'Eventos' },
    { name: 'favorite', label: 'Corazón', category: 'Eventos' },
    { name: 'stars', label: 'Estrellas', category: 'Eventos' },
    
    // Pan y masas
    { name: 'Washoku', label: 'Postre', category: 'Panadería' },
    { name: 'restaurant', label: 'Restaurante', category: 'General' },
    { name: 'lunch_dining', label: 'Comida', category: 'General' },
    { name: 'dinner_dining', label: 'Cena', category: 'General' },
    { name: 'egg', label: 'Huevo', category: 'Ingredientes' },
];

// COMPONENTE PRINCIPAL
const IconSelector: React.FC<IconPickerProps> = ({ 
    value, 
    onChange, 
    id = 'icono', 
    name = 'icono' 
}) => {
    // ESTADOS
    // Controla si el panel de sugerencias está abierto
    const [showSuggestions, setShowSuggestions] = useState(false);
    // MANEJADORES
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };
    // seleccionar icono de las sugerencias
    const handleIconSelect = (iconName: string) => {
        onChange(iconName);
        setShowSuggestions(false); // Cerrar panel al seleccionar
    };
    // RENDER
    return (
        <div className="space-y-3">
            <label htmlFor={id} className="block text-sm font-medium text-text-primary">
                Ícono (Material Symbol)
            </label>
            {/* input con preview del icono */}
            <div className="flex gap-3 items-center">
                {/* Input de texto */}
                <div className="flex-1">
                    <input 
                        type="text" 
                        name={name} 
                        id={id} 
                        value={value} 
                        onChange={handleInputChange}
                        required 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm" 
                        placeholder="Ej: cake" 
                    />
                </div>
                
                {/* preview del icono en tiempo real*/}
                <div className="flex-shrink-0 w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {value ? (
                        <span 
                            className="material-symbols-outlined text-4xl text-secondary"
                            title={`Ícono: ${value}`}
                        >
                            {value}
                        </span>
                    ) : (
                        <span className="material-symbols-outlined text-4xl text-gray-300">
                            help_outline
                        </span>
                    )}
                </div>
            </div>
            {/* Botón para mostrar sugerencias */}
            <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-sm text-secondary hover:text-secondary-dark font-medium flex items-center gap-1"
            >
                <span className="material-symbols-outlined text-lg">
                    {showSuggestions ? 'expand_less' : 'expand_more'}
                </span>
                {showSuggestions ? 'Ocultar sugerencias' : 'Ver íconos sugeridos'}
            </button>
            {/* Panel de sugerencias */}
            {showSuggestions && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4 animate-fadeIn">
                    {/* Texto explicativo */}
                    <p className="text-sm text-gray-600">
                        Haz clic en un ícono para seleccionarlo:
                    </p>
                    
                    {/*íconos sugeridos */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {POPULAR_ICONS.map(icon => (
                            <button
                                key={icon.name}
                                type="button"
                                onClick={() => handleIconSelect(icon.name)}
                                className={`
                                    flex flex-col items-center justify-center p-3 rounded-lg 
                                    transition-all hover:bg-white hover:shadow-md
                                    ${value === icon.name 
                                        ? 'bg-secondary text-white ring-2 ring-secondary' 
                                        : 'bg-white text-gray-700'
                                    }
                                `}
                                title={icon.label}
                            >
                                {/* Ícono */}
                                <span className="material-symbols-outlined text-3xl">
                                    {icon.name}
                                </span>
                                {/* Nombre corto */}
                                <span className="text-xs mt-1 text-center truncate w-full">
                                    {icon.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    {/* link a Material Symbols */}
                    <div className="pt-3 border-t border-gray-200">
                        <a 
                            href="https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Outlined" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-secondary hover:text-secondary-dark font-medium flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-lg">
                                open_in_new
                            </span>
                            Buscar más íconos en Material Symbols
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                            Copia el nombre del ícono y pégalo arriba
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconSelector;