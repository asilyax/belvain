import { useCallback, useEffect, useRef, useState } from "react";

import { headerCta, logo, navigationLinks } from "../../content/navigation";
import Button from "../ui/Button";
import Container from "./Container";
import "./Header.css";

const SCROLL_THRESHOLD = 8;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const menuButtonRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((currentValue) => !currentValue);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const hero = document.getElementById("hero");
      const heroRect = hero?.getBoundingClientRect();
      const isHeroActive = heroRect && heroRect.bottom > SCROLL_THRESHOLD;

      if (isMenuOpen || isHeroActive || currentScrollY <= SCROLL_THRESHOLD) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      if (scrollDelta <= SCROLL_THRESHOLD) {
        return;
      }

      setIsHidden(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <header className={["site-header", isHidden ? "site-header--hidden" : ""].filter(Boolean).join(" ")}>
      <Container className="site-header__container">
        <a className="site-header__logo-link" href={logo.href} aria-label="Belvain home">
          <img className="site-header__logo" src={logo.src} alt={logo.alt} />
        </a>

        <nav className="site-header__nav" aria-label="Primary navigation">
          {navigationLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <Button href={headerCta.href} variant={headerCta.variant}>
            {headerCta.label}
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          className="site-header__menu-button"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          onClick={toggleMenu}
        >
          <span aria-hidden="true" />
        </button>
      </Container>

      <div
        id="site-menu"
        className="site-header__menu"
        aria-hidden={!isMenuOpen}
        onClick={closeMenu}
      >
        <div className="site-header__menu-panel" onClick={(event) => event.stopPropagation()}>
          <nav aria-label="Mobile navigation">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                className="site-header__menu-link"
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Button
            className="site-header__menu-cta"
            href={headerCta.href}
            variant={headerCta.variant}
            onClick={closeMenu}
          >
            {headerCta.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
