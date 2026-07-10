import Section from "../../../components/layout/Section";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Button from "../../../components/ui/Button";
import Eyebrow from "../../../components/ui/Eyebrow";
import { medicalAestheticsContent } from "../../../content/home/medicalAesthetics";
import "./MedicalAestheticsPreview.css";

export default function MedicalAestheticsPreview() {
  const {
    eyebrow,
    titleLines,
    descriptionLines,
    buttonLabel,
    buttonHref,
    backgroundImages,
    cards,
  } = medicalAestheticsContent;

  return (
    <Section
      className="medical-aesthetics-preview"
      id="medical-aesthetics"
      aria-labelledby="medical-aesthetics-title"
    >
      <div className="medical-aesthetics-preview__media" aria-hidden="true">
        <picture className="medical-aesthetics-preview__picture">
          <source media="(min-width: 1280px)" srcSet={backgroundImages.desktop} />
          <source media="(min-width: 768px)" srcSet={backgroundImages.tablet} />
          <img
            className="medical-aesthetics-preview__picture-image"
            src={backgroundImages.mobile}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <Container className="medical-aesthetics-preview__container">
        <div className="medical-aesthetics-preview__main">
          <div className="medical-aesthetics-preview__intro">
            <SectionHeader
              className="medical-aesthetics-preview__header"
              variant="dark"
              align="left"
              headingLevel={2}
              titleId="medical-aesthetics-title"
              titleLines={titleLines}
              descriptionLines={descriptionLines}
              eyebrow={eyebrow}
            />
            <Button
              className="medical-aesthetics-preview__cta"
              href={buttonHref}
              variant="primary"
            >
              {buttonLabel}
            </Button>
          </div>

          <ul className="medical-aesthetics-preview__cards" role="list">
            {cards.map((card) => (
              <li key={card.id} className="medical-aesthetics-preview__card-item">
                <article className="medical-aesthetics-preview__card">
                  <img
                    className="medical-aesthetics-preview__card-image"
                    src={card.image}
                    alt={card.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="medical-aesthetics-preview__card-body">
                    <Eyebrow className="medical-aesthetics-preview__card-eyebrow">
                      {card.eyebrow}
                    </Eyebrow>
                    <h3
                      className="medical-aesthetics-preview__card-title"
                      style={{ maxWidth: `${card.titleMaxWidth}px` }}
                    >
                      {card.title}
                    </h3>
                    <hr
                      className="medical-aesthetics-preview__card-divider"
                      aria-hidden="true"
                    />
                    <p
                      className="medical-aesthetics-preview__card-description text-body"
                      style={{ maxWidth: `${card.descriptionMaxWidth}px` }}
                    >
                      {card.description}
                    </p>
                    <div className="medical-aesthetics-preview__card-footer">
                      <Button
                        className="medical-aesthetics-preview__card-cta"
                        href={card.href}
                        variant="secondary-dark"
                      >
                        {card.buttonLabel}
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
