import { useCallback, useEffect, useRef } from "react";
import Section from "../../../components/layout/Section";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Button from "../../../components/ui/Button";
import { experiencesContent } from "../../../content/home/experiences";
import "./ExperiencesPreview.css";

const CROP_GAP_THRESHOLD = 96;
const TABLET_BREAKPOINT = 768;

export default function ExperiencesPreview() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  const {
    eyebrow,
    title,
    description,
    supportingText,
    buttonLabel,
    buttonHref,
    backgroundImages,
  } = experiencesContent;

  const evaluateCropMode = useCallback(() => {
    const content = contentRef.current;
    const image = imageRef.current;
    const container = content?.parentElement;
    const section = container?.closest(".experiences-preview");

    if (!section || !container || !content || !image) {
      return;
    }

    if (window.innerWidth >= TABLET_BREAKPOINT) {
      section.classList.remove("experiences-preview--crop-bg");
      return;
    }

    if (!image.naturalWidth || !image.naturalHeight) {
      return;
    }

    const sectionWidth = section.offsetWidth;
    const containedImageHeight =
      sectionWidth * (image.naturalHeight / image.naturalWidth);
    const contentBlockHeight = content.offsetHeight;
    const gapEachSide = (containedImageHeight - contentBlockHeight) / 2;

    section.classList.toggle(
      "experiences-preview--crop-bg",
      gapEachSide > CROP_GAP_THRESHOLD
    );
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    const image = imageRef.current;

    if (!image || !content) {
      return;
    }

    const handleImageReady = () => evaluateCropMode();

    if (image.complete && image.naturalWidth) {
      handleImageReady();
    } else {
      image.addEventListener("load", handleImageReady);
    }

    const resizeObserver = new ResizeObserver(() => evaluateCropMode());
    resizeObserver.observe(content);

    window.addEventListener("resize", evaluateCropMode);

    return () => {
      image.removeEventListener("load", handleImageReady);
      resizeObserver.disconnect();
      window.removeEventListener("resize", evaluateCropMode);
    };
  }, [evaluateCropMode]);

  return (
    <Section
      className="experiences-preview"
      id="experiences"
      aria-labelledby="experiences-title"
    >
      <div className="experiences-preview__media" aria-hidden="true">
        <picture className="experiences-preview__picture">
          <source media="(min-width: 1024px)" srcSet={backgroundImages.desktop} />
          <source media="(min-width: 768px)" srcSet={backgroundImages.tablet} />
          <img
            ref={imageRef}
            className="experiences-preview__picture-image"
            src={backgroundImages.mobile}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <Container className="experiences-preview__container">
        <div ref={contentRef} className="experiences-preview__content">
          <SectionHeader
            className="experiences-preview__header"
            align="left"
            headingLevel={2}
            titleId="experiences-title"
            eyebrow={eyebrow}
            title={title}
            description={description}
            supportingText={supportingText}
          />
          <Button
            className="experiences-preview__cta"
            href={buttonHref}
            variant="secondary-inverse"
          >
            {buttonLabel}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
