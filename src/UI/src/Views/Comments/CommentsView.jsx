import React from 'react';
import '../../wwwroot/css/Views/Views.css';

function CommentsView() {
    return (
        <div className="view-container">
            <div className="view-header">
                <div className="view-header__title-group">
                    <h2>Comentarios y Reseñas</h2>
                    <p>Opiniones, valoraciones y experiencias compartidas por la comunidad.</p>
                </div>
                <button className="btn-primary-action" type="button">
                    <i className="ti ti-plus"></i>
                    <span>Nuevo Comentario</span>
                </button>
            </div>

            <div className="empty-view-card">
                <div className="empty-view-card__icon">
                    <i className="ti ti-message-2"></i>
                </div>
                <h3>No hay comentarios publicados</h3>
                <p>
                    Los comentarios de los usuarios aparecerán aquí. Puedes crear una nueva reseña o responder a los clientes.
                </p>
            </div>
        </div>
    );
}

export default CommentsView;
