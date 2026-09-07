import React from "react";
import "./ToggleSwitch.css";

const joinClassNames = (...classNames) =>
  classNames.filter(Boolean).join(" ");

export function ToggleSwitch({
  checked = false,
  onChange,
  yesLabel = "SI",
  noLabel = "NO",
  disabled = false,
  label = null,
  id,
  name,
  className = "",
  ariaLabel,
}) {
  const isChecked = Boolean(checked);

  const handleToggle = () => {
    if (disabled || !onChange) return;
    onChange(!isChecked);
  };

  const handleKeyDown = (event) => {
    if (disabled || !onChange) return;
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onChange(!isChecked);
    }
  };

  return (
    <div
      className={joinClassNames(
        "common-toggle-switch-wrapper",
        disabled && "common-toggle-switch-wrapper--disabled",
        className
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className="common-toggle-switch__label"
          onClick={handleToggle}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        name={name}
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel || label || (isChecked ? yesLabel : noLabel)}
        disabled={disabled}
        className={joinClassNames(
          "common-toggle-switch",
          isChecked
            ? "common-toggle-switch--checked common-toggle-switch--yes"
            : "common-toggle-switch--unchecked common-toggle-switch--no"
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span
          className="common-toggle-switch__slot common-toggle-switch__slot--left"
          aria-hidden="true"
        >
          {noLabel}
        </span>

        <span
          className="common-toggle-switch__divider"
          aria-hidden="true"
        />

        <span
          className="common-toggle-switch__slot common-toggle-switch__slot--right"
          aria-hidden="true"
        >
          {yesLabel}
        </span>

        <span
          className={joinClassNames(
            "common-toggle-switch__block",
            isChecked
              ? "common-toggle-switch__block--yes"
              : "common-toggle-switch__block--no"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default ToggleSwitch;
