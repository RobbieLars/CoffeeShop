import React from 'react';
import '../../wwwroot/css/Views/Views.css';

function ProductsView() {
    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header__title-group">
                    <h2>Gestión de Productos</h2>
                    <p>Catálogo de café, bebidas, postres y artículos de la tienda.</p>
                </div>
                <button className="btn-primary-action" type="button">
                    <i className="ti ti-plus"></i>
                    <span>Nuevo Producto</span>
                </button>
            </div>

            <div className="empty-view-card">
                <div className="empty-view-card__icon">
                    <i className="ti ti-coffee"></i>
                </div>
                <h3>No hay productos registrados</h3>
                <p>
                    Comienza agregando el primer producto al catálogo para que esté disponible para compras.
                </p>
            </div>
        </div>
    );
}

export default ProductsView;
