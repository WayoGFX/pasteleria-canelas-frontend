import React from 'react';
import { Link } from 'react-router-dom';
import { Category as CategoryType } from '../types';

const CategoryCard: React.FC<{ category: CategoryType }> = ({ category }) => {
    const path = `/category/${category.slug}`;
    return (
        <Link to={path} className="group block active:scale-[0.98] transition-all duration-300 hover:-translate-y-1">
            <div className="relative overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-glow-accent h-44">
                <img 
                    alt={category.name} 
                    loading="lazy" 
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
                    src={category.image} 
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/50">
                    <div className="flex justify-between items-end">
                        <h2 className="text-white text-xl md:text-2xl font-serif-display tracking-wider">{category.name}</h2>
                        <span className="material-symbols-outlined text-white/80 text-3xl transition-transform duration-300 group-hover:translate-x-1">{category.icon}</span>
                    </div>
                    
                    <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2 transition-all duration-500 ease-in-out">
                        <p className="text-white/90 text-sm leading-snug">
                            {category.description}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;