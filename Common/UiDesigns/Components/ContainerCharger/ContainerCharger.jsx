/**
 * ContainerCharger.jsx - Gestor Central de Contenedores de Recarga Asíncrona
 * Ubicación: Common/UiDesigns/Components/ContainerCharger/ContainerCharger.jsx
 *
 * Propósito:
 * Contenedor estructural con línea de progreso superior animada y boundary de error.
 * Permite recargar asíncronamente bloques individuales de contenido sin provocar
 * saltos o parpadeos globales en la pantalla, ofreciendo un estado de fallo
 * aislado con botón de reintento.
 *
 * @module ContainerCharger
 */

import React from "react";
import "./ContainerCharger.css";

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(" ");

/**
 * @typedef {Object} ContainerChargerProps
 * @property {boolean} [loading=false] - Indica si el contenedor está en proceso de recarga.
 * @property {string} [loadingText=""] - Texto auxiliar descriptivo durante la carga.
 * @property {string|Error|null} [error=null] - Objeto o mensaje de error para activar el estado de fallo.
 * @property {Function} [onRetry] - Callback invocado al pulsar el botón de reintento.
 * @property {React.ReactNode} children - Contenido reactivo envuelto por el contenedor.
 * @property {string} [className=""] - Clases CSS complementarias.
 * @property {string} [retryLabel="Reintentar"] - Texto del botón de reintento.
 */

export function ContainerCharger({
  loading = false,
  loadingText = "",
  error = null,
  onRetry,
  children,
  className = "",
  retryLabel = "Reintentar",
  ...rest
}) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div
      className={joinClassNames(
        "common-container-charger",
        loading && "common-container-charger--loading",
        Boolean(error) && "common-container-charger--error",
        className
      )}
      aria-busy={loading}
      {...rest}
    >
      {/* Barra de progreso superior animada */}
      {loading && (
        <div
          className="common-container-charger__bar"
          role="progressbar"
          aria-label={loadingText || "Actualizando datos..."}
        >
          <div className="common-container-charger__line" />
        </div>
      )}

      {/* Boundary de Error con Reintento */}
      {error ? (
        <div className="common-container-charger__error" role="alert">
          <div className="common-container-charger__error-message">
            <span className="common-container-charger__error-icon" aria-hidden="true">
              <i className="ti ti-alert-triangle" />
            </span>
            <span>{errorMessage || "No fue posible actualizar este cuadro."}</span>
          </div>
          {typeof onRetry === "function" && (
            <button
              type="button"
              className="common-container-charger__retry-btn"
              onClick={onRetry}
            >
              <i className="ti ti-refresh me-1" aria-hidden="true" />
              <span>{retryLabel}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="common-container-charger__body">
          {children}
        </div>
      )}

      {/* Badge flotante opcional con estado descriptivo */}
      {loading && Boolean(loadingText) && (
        <div className="common-container-charger__badge" aria-live="polite">
          <span className="common-container-charger__badge-spinner" aria-hidden="true" />
          <span>{loadingText}</span>
        </div>
      )}
    </div>
  );
}

export default ContainerCharger;
