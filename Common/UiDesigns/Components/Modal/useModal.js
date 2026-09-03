import {
  useCallback,
  useEffect,
  useRef,
} from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

let openedModalCount = 0;
let previousBodyOverflow = "";

const lockDocumentScroll = () => {
  if (typeof document === "undefined") return;

  if (openedModalCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
  }

  openedModalCount += 1;
  document.body.style.overflow = "hidden";
};

const unlockDocumentScroll = () => {
  if (typeof document === "undefined") return;

  openedModalCount = Math.max(0, openedModalCount - 1);

  if (openedModalCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
};

export function useModal({
  open,
  onClose,
  closeOnOutsideClick = false,
  closeOnEscape = true,
} = {}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const closeOnOutsideClickRef = useRef(
    closeOnOutsideClick
  );
  const closeOnEscapeRef = useRef(closeOnEscape);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    closeOnOutsideClickRef.current =
      closeOnOutsideClick;
  }, [closeOnOutsideClick]);

  useEffect(() => {
    closeOnEscapeRef.current = closeOnEscape;
  }, [closeOnEscape]);

  const requestClose = useCallback((reason, event) => {
    onCloseRef.current?.(reason, event);
  }, []);

  const handleBackdropPointerDown = useCallback(
    (event) => {
      const clickedDirectlyOnBackdrop =
        event.target === event.currentTarget;

      if (
        clickedDirectlyOnBackdrop &&
        closeOnOutsideClickRef.current
      ) {
        requestClose("outside-click", event);
      }
    },
    [requestClose]
  );

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return undefined;
    }

    const previouslyFocusedElement =
      document.activeElement;

    lockDocumentScroll();

    const focusFrame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;

      if (!dialog) return;

      const preferredElement = dialog.querySelector(
        "[data-modal-autofocus]"
      );

      const firstFocusableElement =
        dialog.querySelector(focusableSelector);

      (
        preferredElement ??
        firstFocusableElement ??
        dialog
      ).focus();
    });

    const handleKeyDown = (event) => {
      const dialog = dialogRef.current;

      if (!dialog) return;

      if (
        event.key === "Escape" &&
        closeOnEscapeRef.current
      ) {
        event.preventDefault();
        requestClose("escape", event);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialog.querySelectorAll(focusableSelector)
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      unlockDocumentScroll();

      if (
        previouslyFocusedElement instanceof HTMLElement &&
        previouslyFocusedElement.isConnected
      ) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open, requestClose]);

  return {
    dialogRef,
    requestClose,
    handleBackdropPointerDown,
  };
}

export default useModal;