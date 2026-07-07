export default function Eyebrow({ as: Component = "p", className, children, ...props }) {
  if (!children) {
    return null;
  }

  const classes = ["text-eyebrow", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
