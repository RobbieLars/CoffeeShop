/**
 * BranchCarousel.jsx - Motor Central de Navegación por Pasos y Ramas
 * Ubicación: Common/UiDesigns/Components/BranchCarousel/BranchCarousel.jsx
 *
 * Propósito:
 * Componente estructural tipo carrusel / wizard para orquestar flujos
 * secuenciales o ramificados (ej. Menú -> Personalización -> Pago)
 * sin recargar la página ni alterar el historial de navegación de forma invasiva.
 *
 * @module BranchCarousel
 */

import React from "react";
import "./BranchCarousel.css";

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(" ");

/**
 * @typedef {Object} BranchCarouselProps
 * @property {number} [activePage=1] - Página o paso activo (1-indexado).
 * @property {number|string} [activeBranch=1] - Identificador de rama activa en flujos condicionales.
 * @property {React.ReactNode} children - Diapositivas o pasos que componen el carrusel.
 * @property {string} [className=""] - Clases CSS del contenedor externo.
 * @property {string} [ariaLabel="Flujo de pasos interactivo"] - Etiqueta de accesibilidad ARIA.
 */

export function BranchCarousel({
  activePage = 1,
  activeBranch = 1,
  children,
  className = "",
  ariaLabel = "Flujo de pasos interactivo",
  ...rest
}) {
  const pages = React.Children.toArray(children);
  const totalPages = pages.length || 1;
  const safePage = Math.max(1, Math.min(activePage, totalPages));
  const offsetPercentage = -(safePage - 1) * 100;

  return (
    <div
      className={joinClassNames("common-branch-carousel", className)}
      role="region"
      aria-label={ariaLabel}
      data-active-page={safePage}
      data-active-branch={activeBranch}
      {...rest}
    >
      <div
        className="common-branch-carousel__track"
        style={{ transform: `translateX(${offsetPercentage}%)` }}
      >
        {pages.map((child, index) => {
          const pageNumber = index + 1;
          const isActive = pageNumber === safePage;

          return (
            <div
              key={child.key ?? index}
              className={joinClassNames(
                "common-branch-carousel__slide",
                isActive && "common-branch-carousel__slide--active"
              )}
              aria-hidden={!isActive}
              data-page-index={pageNumber}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BranchCarousel;
