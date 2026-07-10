import "./Button.css";

const BUTTON_VARIANTS = ["primary", "secondary-dark", "secondary-light", "secondary-inverse"];
const BUTTON_SIZES = ["md"];

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  ...props
}) {
  const safeVariant = BUTTON_VARIANTS.includes(variant) ? variant : "primary";
  const safeSize = BUTTON_SIZES.includes(size) ? size : "md";
  const classes = ["btn", `btn--${safeVariant}`, `btn--${safeSize}`, className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
