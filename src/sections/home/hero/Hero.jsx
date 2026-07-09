import Container from "../../../components/layout/Container";
import Section from "../../../components/layout/Section";
import Eyebrow from "../../../components/ui/Eyebrow";
import { heroContent } from "../../../content/hero";
import "./Hero.css";

export default function Hero() {
  const { backgroundImages, description, eyebrow, title } = heroContent;

  return (
    <Section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <picture className="hero__picture">
          <source media="(min-width: 1280px)" srcSet={backgroundImages.desktop} />
          <source media="(min-width: 768px)" srcSet={backgroundImages.tablet} />
          <img
            className="hero__image"
            src={backgroundImages.mobile}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>

      <Container className="hero__container">
        <div className="hero__content">
          <Eyebrow className="hero__eyebrow">{eyebrow}</Eyebrow>
          <h1 className="hero__title" id="hero-title">
            {title}
          </h1>
          <p className="hero__description text-subtitle">{description}</p>
        </div>
      </Container>
    </Section>
  );
}
