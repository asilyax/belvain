export default function Container({ as: Component = "div", className, children, ...props }) {
  const classes = ["container", className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
