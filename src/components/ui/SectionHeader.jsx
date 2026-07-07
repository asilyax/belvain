import Eyebrow from "./Eyebrow";
import "./SectionHeader.css";

const ALIGNMENTS = ["left", "center"];
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

export default function SectionHeader({
  eyebrow,
  title,
  description,
  headingLevel = 2,
  align = "left",
  className,
  ...props
}) {
  if (!title) {
    return null;
  }

  const safeHeadingLevel = HEADING_LEVELS.includes(headingLevel) ? headingLevel : 2;
  const safeAlign = ALIGNMENTS.includes(align) ? align : "left";
  const Heading = `h${safeHeadingLevel}`;
  const classes = ["section-header", `section-header--${safeAlign}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {eyebrow ? (
        <Eyebrow className="section-header__eyebrow">{eyebrow}</Eyebrow>
      ) : null}
      <Heading className="section-header__title">{title}</Heading>
      {description ? (
        <p className="section-header__description text-subtitle">{description}</p>
      ) : null}
    </div>
  );
}
