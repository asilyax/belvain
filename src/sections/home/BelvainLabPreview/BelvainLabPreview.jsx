import { useCallback, useEffect, useRef } from "react";
import Section from "../../../components/layout/Section";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Button from "../../../components/ui/Button";
import { belvainLabContent } from "../../../content/home/belvainLab";
import "./BelvainLabPreview.css";

const CROP_GAP_THRESHOLD = 96;
const TABLET_BREAKPOINT = 768;

export default function BelvainLabPreview() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  const {
    eyebrow,
    title,
    description,
    buttonLabel,
    buttonHref,
    backgroundImages,
  } = belvainLabContent;

  const evaluateCropMode = useCallback(() => {
    const content = contentRef.current;
    const image = imageRef.current;
    const container = content?.parentElement;
    const section = container?.closest(".belvain-lab-preview");

    if (!section || !container || !content || !image) {
      return;
    }

    if (window.innerWidth >= TABLET_BREAKPOINT) {
      section.classList.remove("belvain-lab-preview--crop-bg");
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
      "belvain-lab-preview--crop-bg",
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
      className="belvain-lab-preview"
      id="shop"
      aria-labelledby="belvain-lab-title"
    >
      <div className="belvain-lab-preview__media" aria-hidden="true">
        <picture className="belvain-lab-preview__picture">
          <source media="(min-width: 1024px)" srcSet={backgroundImages.desktop} />
          <source media="(min-width: 768px)" srcSet={backgroundImages.tablet} />
          <img
            ref={imageRef}
            className="belvain-lab-preview__picture-image"
            src={backgroundImages.mobile}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <Container className="belvain-lab-preview__container">
        <div ref={contentRef} className="belvain-lab-preview__content">
          <SectionHeader
            className="belvain-lab-preview__header"
            align="left"
            headingLevel={2}
            titleId="belvain-lab-title"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <Button
            className="belvain-lab-preview__cta"
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
