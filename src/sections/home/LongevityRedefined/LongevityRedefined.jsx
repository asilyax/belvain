import { useCallback, useEffect, useRef } from "react";
import Section from "../../../components/layout/Section";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Button from "../../../components/ui/Button";
import { longevityContent } from "../../../content/home/longevity";
import "./LongevityRedefined.css";

const CROP_GAP_THRESHOLD = 90;
const TABLET_BREAKPOINT = 768;

export default function LongevityRedefined() {
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
  } = longevityContent;

  const evaluateCropMode = useCallback(() => {
    const content = contentRef.current;
    const image = imageRef.current;
    const container = content?.parentElement;
    const section = container?.closest(".longevity-redefined");

    if (!section || !container || !content || !image) {
      return;
    }

    if (window.innerWidth >= TABLET_BREAKPOINT) {
      section.classList.remove("longevity-redefined--crop-bg");
      return;
    }

    if (!image.naturalWidth || !image.naturalHeight) {
      return;
    }

    const sectionWidth = section.offsetWidth;
    const containedImageHeight =
      sectionWidth * (image.naturalHeight / image.naturalWidth);
    const containerStyle = getComputedStyle(container);
    const contentBlockHeight =
      content.offsetHeight +
      parseFloat(containerStyle.paddingTop) +
      parseFloat(containerStyle.paddingBottom);
    const gapEachSide = (containedImageHeight - contentBlockHeight) / 2;

    section.classList.toggle(
      "longevity-redefined--crop-bg",
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
    <Section className="longevity-redefined" id="longevity" aria-labelledby="longevity-title">
      <div className="longevity-redefined__media" aria-hidden="true">
        <picture className="longevity-redefined__picture">
          <source media="(min-width: 1024px)" srcSet={backgroundImages.desktop} />
          <source media="(min-width: 768px)" srcSet={backgroundImages.tablet} />
          <img
            ref={imageRef}
            className="longevity-redefined__picture-image"
            src={backgroundImages.mobile}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <Container className="longevity-redefined__container">
        <div ref={contentRef} className="longevity-redefined__content">
          <SectionHeader
            className="longevity-redefined__header"
            align="left"
            headingLevel={2}
            titleId="longevity-title"
            titleLines={title}
            eyebrow={eyebrow}
            description={description}
            supportingText={supportingText}
          />
          <Button className="longevity-redefined__cta" href={buttonHref} variant="primary">
            {buttonLabel}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
