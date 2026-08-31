import React from 'react';
import '../../wwwroot/css/Views/Views.css';

function DashboardContentView() {
    return (
        <div className="view-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card__icon">
                        <i className="ti ti-coffee"></i>
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Productos</span>
                        <span className="stat-card__value">0</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon">
                        <i className="ti ti-message-2"></i>
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Comentarios</span>
                        <span className="stat-card__value">0</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon">
                        <i className="ti ti-shopping-cart"></i>
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Compras</span>
                        <span className="stat-card__value">0</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon">
                        <i className="ti ti-paw"></i>
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__label">Mascotas</span>
                        <span className="stat-card__value">0</span>
                    </div>
                </div>
            </div>

            <div className="empty-view-card">
                <div className="empty-view-card__icon">
                    <i className="ti ti-layout-dashboard"></i>
                </div>
                <h3>Panel de Control Principal</h3>
                <p>
                    Bienvenido al panel de administración de CoffeeShop. Selecciona una sección en el menú lateral para comenzar.
                </p>
            </div>
        </div>
    );
}

export default DashboardContentView;
