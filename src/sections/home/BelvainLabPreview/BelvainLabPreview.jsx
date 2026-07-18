import { useCallback, useEffect, useRef, useState } from "react";
import Section from "../../../components/layout/Section";
import Container from "../../../components/layout/Container";
import SectionHeader from "../../../components/ui/SectionHeader";
import Button from "../../../components/ui/Button";
import { belvainLabContent } from "../../../content/home/belvainLab";
import "./BelvainLabPreview.css";

const CROP_GAP_THRESHOLD = 96;
const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1280;
const SCROLL_EDGE_TOLERANCE = 8;

function getStripMetrics() {
  const width = window.innerWidth;

  if (width >= DESKTOP_BREAKPOINT) {
    return { cardWidth: 360, gap: 32, initialIndex: 1 };
  }

  if (width >= TABLET_BREAKPOINT) {
    return { cardWidth: 278, gap: 28, initialIndex: 0 };
  }

  return { cardWidth: 326, gap: 0, initialIndex: 0 };
}

function supportsFineHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export default function BelvainLabPreview() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const stripTrackRef = useRef(null);
  const hasInitializedScroll = useRef(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const {
    eyebrow,
    title,
    description,
    buttonLabel,
    buttonHref,
    backgroundImages,
    cards,
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

  const getStripItems = useCallback(() => {
    const track = stripTrackRef.current;
    if (!track) {
      return [];
    }

    return Array.from(track.querySelectorAll(".belvain-lab-preview__strip-item"));
  }, []);

  const updateArrowState = useCallback(() => {
    const track = stripTrackRef.current;
    if (!track) {
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > SCROLL_EDGE_TOLERANCE);
    setCanScrollNext(track.scrollLeft < maxScroll - SCROLL_EDGE_TOLERANCE);
  }, []);

  const scrollToCardIndex = useCallback(
    (index, behavior = "smooth") => {
      const track = stripTrackRef.current;
      const items = getStripItems();
      const item = items[index];

      if (!track || !item) {
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const delta =
        itemRect.left + itemRect.width / 2 - (trackRect.left + trackRect.width / 2);

      track.scrollBy({ left: delta, behavior });
    },
    [getStripItems]
  );

  const syncStripLayout = useCallback(
    (options = {}) => {
      const { resetInitial = false } = options;
      const track = stripTrackRef.current;

      if (!track) {
        return;
      }

      const { cardWidth, initialIndex } = getStripMetrics();
      const peaking = Math.max(0, (track.clientWidth - cardWidth) / 2);
      track.style.paddingInline = `${peaking}px`;

      if (resetInitial || !hasInitializedScroll.current) {
        hasInitializedScroll.current = true;
        requestAnimationFrame(() => {
          scrollToCardIndex(initialIndex, "auto");
          updateArrowState();
        });
        return;
      }

      updateArrowState();
    },
    [scrollToCardIndex, updateArrowState]
  );

  const getClosestCardIndex = useCallback(() => {
    const track = stripTrackRef.current;
    const items = getStripItems();

    if (!track || items.length === 0) {
      return 0;
    }

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [getStripItems]);

  const handlePrevClick = useCallback(() => {
    const nextIndex = Math.max(0, getClosestCardIndex() - 1);
    scrollToCardIndex(nextIndex);
  }, [getClosestCardIndex, scrollToCardIndex]);

  const handleNextClick = useCallback(() => {
    const items = getStripItems();
    const nextIndex = Math.min(items.length - 1, getClosestCardIndex() + 1);
    scrollToCardIndex(nextIndex);
  }, [getClosestCardIndex, getStripItems, scrollToCardIndex]);

  const handleCardPointerUp = useCallback((event) => {
    if (supportsFineHover()) {
      return;
    }

    if (event.target.closest("a, button")) {
      return;
    }

    event.currentTarget.classList.add("belvain-lab-preview__card--revealed");
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

  useEffect(() => {
    const track = stripTrackRef.current;

    if (!track) {
      return;
    }

    const handleScroll = () => updateArrowState();
    const handleResize = () => {
      hasInitializedScroll.current = false;
      syncStripLayout({ resetInitial: true });
    };

    syncStripLayout({ resetInitial: true });

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      syncStripLayout();
    });
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [syncStripLayout, updateArrowState]);

  return (
    <Section
      className="belvain-lab-preview"
      id="shop"
      aria-labelledby="belvain-lab-title"
    >
      <div className="belvain-lab-preview__stage">
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
      </div>

      <div className="belvain-lab-preview__strip">
        <button
          type="button"
          className="belvain-lab-preview__strip-arrow belvain-lab-preview__strip-arrow--prev"
          aria-label="Previous products"
          aria-disabled={!canScrollPrev}
          disabled={!canScrollPrev}
          onClick={handlePrevClick}
        >
          <svg
            className="belvain-lab-preview__strip-arrow-icon"
            viewBox="0 0 20 32"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M14.5 2.5 3.5 16l11 13.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className="belvain-lab-preview__strip-track"
          ref={stripTrackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Belvain Lab products"
        >
          <ul className="belvain-lab-preview__strip-list" role="list">
            {cards.map((card) => (
              <li key={card.id} className="belvain-lab-preview__strip-item">
                <article
                  className="belvain-lab-preview__card"
                  data-card-id={card.id}
                  onPointerUp={handleCardPointerUp}
                >
                  <img
                    className="belvain-lab-preview__card-image"
                    src={card.image}
                    alt={card.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="belvain-lab-preview__card-overlay"
                    aria-hidden="true"
                  />
                  <div className="belvain-lab-preview__card-content">
                    <p className="belvain-lab-preview__card-label">{card.label}</p>
                    <h3 className="belvain-lab-preview__card-title">{card.title}</h3>
                    <p className="belvain-lab-preview__card-description">
                      {card.description}
                    </p>
                    <Button
                      className="belvain-lab-preview__card-cta"
                      href={card.href}
                      variant="secondary-inverse"
                    >
                      {card.buttonLabel}
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="belvain-lab-preview__strip-arrow belvain-lab-preview__strip-arrow--next"
          aria-label="Next products"
          aria-disabled={!canScrollNext}
          disabled={!canScrollNext}
          onClick={handleNextClick}
        >
          <svg
            className="belvain-lab-preview__strip-arrow-icon"
            viewBox="0 0 20 32"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5.5 2.5 16.5 16l-11 13.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </Section>
  );
}
