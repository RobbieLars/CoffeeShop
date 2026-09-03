import { useId } from "react";
import "./PageContainer.css";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export function PageContainer({
  title,
  description,
  children,

  onHelp,
  helpLabel = "Ayuda",
  helpIcon = "ti ti-help-circle",

  onBack,
  backLabel = "Volver",
  backIcon = "ti ti-arrow-left",

  actions = null,

  titleId,
  className = "",
  headerClassName = "",
  contentClassName = "",
  actionsClassName = "",
  style,
}) {
  const generatedId = useId().replaceAll(":", "");
  const resolvedTitleId =
    titleId ?? `common-page-title-${generatedId}`;

  const hasActions = Boolean(
    onHelp || onBack || actions
  );

  return (
    <section
      className={joinClassNames(
        "common-page-container",
        className
      )}
      aria-labelledby={title ? resolvedTitleId : undefined}
      style={style}
    >
      <header
        className={joinClassNames(
          "common-page-container__header",
          headerClassName
        )}
      >
        <div className="common-page-container__heading">
          {title && (
            <h1
              id={resolvedTitleId}
              className="common-page-container__title"
            >
              {title}
            </h1>
          )}

          {description && (
            <p className="common-page-container__description">
              {description}
            </p>
          )}
        </div>

        {hasActions && (
          <div
            className={joinClassNames(
              "common-page-container__actions",
              actionsClassName
            )}
          >
            {onHelp && (
              <button
                type="button"
                className="
                  common-page-container__action
                  common-page-container__help
                "
                aria-label={helpLabel}
                title={helpLabel}
                onClick={onHelp}
              >
                {helpIcon ? (
                  <i className={helpIcon} aria-hidden="true" />
                ) : (
                  <span>{helpLabel}</span>
                )}
              </button>
            )}

            {actions && (
              <div className="common-page-container__custom-actions">
                {actions}
              </div>
            )}

            {onBack && (
              <button
                type="button"
                className="
                  common-page-container__action
                  common-page-container__back
                "
                onClick={onBack}
              >
                {backIcon && (
                  <i className={backIcon} aria-hidden="true" />
                )}

                <span>{backLabel}</span>
              </button>
            )}
          </div>
        )}
      </header>

      <div
        className={joinClassNames(
          "common-page-container__content",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

export default PageContainer;