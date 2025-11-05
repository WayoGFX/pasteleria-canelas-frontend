import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    return (
        <div className="animate-fadeIn">
            <h1 className="font-serif-display text-4xl font-bold text-text-primary mb-4">
                Bienvenido al Panel de Canela
            </h1>
            <p className="text-text-secondary mb-8">
                Desde aquí puedes gestionar las categorías, productos y precios de tu catálogo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="categories" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/20 rounded-full text-secondary">
                            <span className="material-symbols-outlined text-3xl">category</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">Gestionar Categorías</h2>
                            <p className="text-sm text-text-secondary mt-1">Crear, editar y organizar las secciones de tu menú.</p>
                        </div>
                         <span className="material-symbols-outlined text-text-secondary ml-auto transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                </Link>
                <Link to="products" className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/20 rounded-full text-secondary">
                             <span className="material-symbols-outlined text-3xl">inventory_2</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">Gestionar Productos</h2>
                            <p className="text-sm text-text-secondary mt-1">Añadir nuevos postres y administrar sus precios y detalles.</p>
                        </div>
                         <span className="material-symbols-outlined text-text-secondary ml-auto transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
