import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
    const { logout } = useAuth();

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
            isActive 
            ? 'bg-secondary/10 text-secondary' 
            : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
        }`;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 flex-shrink-0 bg-primary border-r border-gray-200 p-4 flex flex-col">
                <div>
                    <div className="font-serif-display text-2xl font-bold text-text-primary mb-8">
                        Admin Panel
                    </div>
                    <nav className="space-y-2">
                        <NavLink to="/admin" end className={navLinkClasses}>
                            <span className="material-symbols-outlined">dashboard</span>
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/admin/categories" className={navLinkClasses}>
                            <span className="material-symbols-outlined">category</span>
                            <span>Categorías</span>
                        </NavLink>
                        <NavLink to="/admin/products" className={navLinkClasses}>
                            <span className="material-symbols-outlined">inventory_2</span>
                            <span>Productos</span>
                        </NavLink>
                    </nav>
                </div>
                <div className="mt-auto">
                     <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-700">
                        <span className="material-symbols-outlined">logout</span>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <main className="flex-grow p-6 md:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
