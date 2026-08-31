import React from 'react';
import '../../wwwroot/css/Views/Views.css';

function PurchasesView() {
    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header__title-group">
                    <h2>Mis Compras</h2>
                    <p>Historial de pedidos realizados, productos y mascotas asociadas.</p>
                </div>
                <button className="btn-primary-action" type="button">
                    <i className="ti ti-shopping-cart-plus"></i>
                    <span>Realizar Compra</span>
                </button>
            </div>

            <div className="empty-view-card">
                <div className="empty-view-card__icon">
                    <i className="ti ti-shopping-cart"></i>
                </div>
                <h3>No tienes compras registradas</h3>
                <p>
                    Cuando compres productos para ti o para tus mascotas, el resumen y comprobantes se mostrarán en esta sección.
                </p>
            </div>
        </div>
    );
}

export default PurchasesView;
