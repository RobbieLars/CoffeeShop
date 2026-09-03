import { useId } from "react";
import { createPortal } from "react-dom";

import "./Modal.css";
import { useModal } from "./useModal";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export function Modal({
  open,
  title,
  children,
  footer = null,

  onClose,
  closeOnOutsideClick = false,
  closeOnEscape = true,

  showCloseButton = true,
  closeLabel = "Cerrar",
  closeIcon = "ti ti-x",

  ariaLabel = "Ventana modal",
  titleId,

  className = "",
  backdropClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",

  style,
}) {
  const generatedId = useId().replaceAll(":", "");
  const resolvedTitleId =
    titleId ?? `common-modal-title-${generatedId}`;

  const {
    dialogRef,
    requestClose,
    handleBackdropPointerDown,
  } = useModal({
    open,
    onClose,
    closeOnOutsideClick,
    closeOnEscape,
  });

  if (!open || typeof document === "undefined") {
    return null;
  }

  const modal = (
    <div
      className={joinClassNames(
        "common-modal__backdrop",
        backdropClassName
      )}
      onPointerDown={handleBackdropPointerDown}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title ? resolvedTitleId : undefined
        }
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
        className={joinClassNames(
          "common-modal",
          className
        )}
        style={style}
      >
        {(title || showCloseButton) && (
          <header
            className={joinClassNames(
              "common-modal__header",
              headerClassName
            )}
          >
            {title && (
              <h2
                id={resolvedTitleId}
                className="common-modal__title"
              >
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                className="common-modal__close"
                aria-label={closeLabel}
                title={closeLabel}
                onClick={(event) =>
                  requestClose("close-button", event)
                }
              >
                {closeIcon ? (
                  <i
                    className={closeIcon}
                    aria-hidden="true"
                  />
                ) : (
                  <span aria-hidden="true">×</span>
                )}
              </button>
            )}
          </header>
        )}

        <div
          className={joinClassNames(
            "common-modal__body",
            bodyClassName
          )}
        >
          {children}
        </div>

        {footer && (
          <footer
            className={joinClassNames(
              "common-modal__footer",
              footerClassName
            )}
          >
            {footer}
          </footer>
        )}
      </section>
    </div>
  );

  return createPortal(modal, document.body);
}

export default Modal;