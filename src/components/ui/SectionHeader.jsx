import Eyebrow from "./Eyebrow";
import "./SectionHeader.css";

const ALIGNMENTS = ["left", "center"];
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];
const VARIANTS = ["light", "dark"];

function renderTitleLines(lines) {
  return lines.map((line, index) => (
    <span key={line}>
      {index > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

export default function SectionHeader({
  eyebrow,
  title,
  titleLines,
  description,
  descriptionLines,
  supportingText,
  variant = "light",
  headingLevel = 2,
  align = "left",
  className,
  titleId,
  ...props
}) {
  if (!title && !titleLines) {
    return null;
  }

  const safeHeadingLevel = HEADING_LEVELS.includes(headingLevel) ? headingLevel : 2;
  const safeAlign = ALIGNMENTS.includes(align) ? align : "left";
  const safeVariant = VARIANTS.includes(variant) ? variant : "light";
  const Heading = `h${safeHeadingLevel}`;
  const classes = [
    "section-header",
    `section-header--${safeAlign}`,
    `section-header--${safeVariant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {eyebrow ? (
        <Eyebrow className="section-header__eyebrow">{eyebrow}</Eyebrow>
      ) : null}
      <Heading className="section-header__title" id={titleId}>
        {titleLines ? (
          <>
            <span className="section-header__title-lines section-header__title-lines--mobile">
              {renderTitleLines(titleLines.mobile)}
            </span>
            <span className="section-header__title-lines section-header__title-lines--tablet">
              {renderTitleLines(titleLines.tablet)}
            </span>
            <span className="section-header__title-lines section-header__title-lines--desktop">
              {renderTitleLines(titleLines.desktop)}
            </span>
          </>
        ) : (
          title
        )}
      </Heading>
      {descriptionLines ? (
        <>
          <p className="section-header__description section-header__description-lines section-header__description-lines--mobile text-subtitle">
            {descriptionLines.mobile}
          </p>
          <p className="section-header__description section-header__description-lines section-header__description-lines--tablet text-subtitle">
            {descriptionLines.tablet}
          </p>
          <p className="section-header__description section-header__description-lines section-header__description-lines--desktop text-subtitle">
            {descriptionLines.desktop}
          </p>
        </>
      ) : description ? (
        <p className="section-header__description text-subtitle">{description}</p>
      ) : null}
      {supportingText ? (
        <p className="section-header__supporting-text text-body">{supportingText}</p>
      ) : null}
    </div>
  );
}
