/**
 * ButtonCooldown.jsx - Componente Central de Enfriamiento y Carga para Botones
 * Ubicación: Common/UiDesigns/Components/ButtonCooldown/ButtonCooldown.jsx
 *
 * Propósito:
 * Componente estructural desacoplado para prevenir la ejecución repetida
 * de acciones críticas (pedidos, pagos, consultas) durante peticiones
 * asíncronas. Controla el estado visual de carga y enfriamiento mediante
 * variables CSS parametrizables.
 *
 * @module ButtonCooldown
 */

import React, { useState } from "react";
import "./ButtonCooldown.css";

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(" ");

/**
 * @typedef {Object} ButtonCooldownProps
 * @property {Function} [onClick] - Función asíncrona o sincrónica ejecutada al accionar el botón.
 * @property {React.ReactNode} children - Contenido o etiqueta principal del botón.
 * @property {string} [loadingText="Procesando..."] - Texto visible mientras se ejecuta la promesa.
 * @property {number} [cooldownMs=0] - Milisegundos adicionales para retener el bloqueo tras finalizar la acción.
 * @property {boolean} [disabled=false] - Estado deshabilitado forzado externamente.
 * @property {"button" | "submit" | "reset"} [type="button"] - Tipo de botón nativo.
 * @property {string} [className=""] - Clases CSS adicionales.
 * @property {string} [ariaLabel] - Etiqueta de accesibilidad ARIA.
 */

export function ButtonCooldown({
  onClick,
  children,
  loadingText = "Procesando...",
  cooldownMs = 0,
  disabled = false,
  type = "button",
  className = "",
  ariaLabel,
  ...rest
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (event) => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      if (typeof onClick === "function") {
        await onClick(event);
      }
    } catch (error) {
      console.error("[ButtonCooldown] Error ejecutando la acción:", error);
    } finally {
      if (cooldownMs > 0) {
        setTimeout(() => setIsLoading(false), cooldownMs);
      } else {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type={type}
      className={joinClassNames(
        "common-btn-cooldown",
        isLoading && "common-btn-cooldown--loading",
        disabled && "common-btn-cooldown--disabled",
        className
      )}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-busy={isLoading}
      aria-label={ariaLabel || (isLoading ? loadingText : undefined)}
      {...rest}
    >
      {isLoading ? (
        <>
          <span className="common-btn-cooldown__spinner" aria-hidden="true" />
          <span className="common-btn-cooldown__text">{loadingText}</span>
        </>
      ) : (
        <span className="common-btn-cooldown__content">{children}</span>
      )}
    </button>
  );
}

export default ButtonCooldown;
