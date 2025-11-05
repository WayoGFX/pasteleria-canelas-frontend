import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import CategoryListPage from './CategoryListPage';
import CategoryFormPage from './CategoryFormPage';
import ProductListPage from './ProductListPage';
import ProductFormPage from './ProductFormPage';

const AdminRouter: React.FC = () => {
    return (
        <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="categories/new" element={<CategoryFormPage />} />
                <Route path="categories/edit/:id" element={<CategoryFormPage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/edit/:id" element={<ProductFormPage />} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;
