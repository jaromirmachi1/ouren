import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { prefersReducedMotion } from '../../utils/performance';
import type { NavKey } from '../../i18n/types';
import { OurenLogo } from '../ui/OurenLogo';

const LEFT_LINK_KEYS = [
  { key: 'sale' as const, to: '/prodej' },
  { key: 'rent' as const, to: '/pronajem' },
  { key: 'weBuy' as const, to: '/kupujeme' },
  { key: 'projects' as const, to: '/projekty' },
];

const RIGHT_LINK_KEYS = [
  { key: 'about' as const, to: '/#about' },
  { key: 'journal' as const, to: '/blog' },
  { key: 'contact' as const, to: '/#contact' },
];

const NAV_LINK_KEYS = [...LEFT_LINK_KEYS, ...RIGHT_LINK_KEYS];

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const Header = styled.header<{ $scrolled: boolean; $light: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.nav};
  width: 100%;
  padding: clamp(20px, 3vh, 36px) ${({ theme }) => theme.spacing.pageX};
  color: ${({ $light, theme }) => ($light ? theme.colors.brightInk : theme.colors.white)};
  pointer-events: none;
  --nav-muted: ${({ $light }) => ($light ? 'rgba(5, 6, 15, 0.62)' : 'rgba(245, 245, 240, 0.74)')};
  --nav-hover: ${({ $light, theme }) => ($light ? theme.colors.navy : theme.colors.ice)};
  --nav-active: ${({ $light, theme }) => ($light ? theme.colors.navy : theme.colors.ice)};
  --nav-dim: ${({ $light }) => ($light ? 'rgba(5, 6, 15, 0.24)' : 'rgba(245, 245, 240, 0.32)')};
  --nav-line: ${({ $light }) => ($light ? 'rgba(0, 10, 103, 0.35)' : 'rgba(203, 223, 238, 0.35)')};
  --nav-mark: ${({ $light, theme }) => ($light ? theme.colors.navy : theme.colors.ice)};

  &::before {
    position: absolute;
    inset: 0 0 auto;
    height: ${({ $light }) => ($light ? '168px' : '140px')};
    background: ${({ $light, $scrolled, theme }) =>
      $light
        ? `linear-gradient(180deg, ${theme.colors.brightBg} 0%, ${theme.colors.brightBg} 68%, transparent 100%)`
        : `linear-gradient(180deg, rgba(5, 6, 15, ${$scrolled ? 0.72 : 0.42}) 0%, transparent 100%)`};
    content: '';
    pointer-events: none;
    transition: background 280ms ${EASE};
  }
`;

const Bar = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: clamp(72px, 9vh, 96px);
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr auto;
    min-height: 64px;
  }
`;

const SideNav = styled.nav<{ $align: 'left' | 'right' }>`
  display: flex;
  align-items: baseline;
  gap: clamp(16px, 1.8vw, 32px);
  justify-content: ${({ $align }) => ($align === 'left' ? 'flex-start' : 'flex-end')};
  grid-column: ${({ $align }) => ($align === 'left' ? 1 : 3)};
  grid-row: 1;

  &:hover a {
    color: var(--nav-dim);
  }

  &:hover a:hover,
  &:hover a:focus-visible {
    color: var(--nav-hover);
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const LogoWrap = styled(Link)<{ $light?: boolean }>`
  position: relative;
  z-index: 2;
  display: inline-flex;
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  align-items: center;
  transition: opacity 220ms ${EASE}, transform 160ms ${EASE};

  img {
    height: clamp(64px, 8.5vw, 96px);
    width: auto;
    filter: ${({ $light }) => ($light ? 'brightness(0)' : 'none')};
  }

  &:hover {
    opacity: 0.82;
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 980px) {
    grid-column: 1 / -1;
    justify-self: center;

    img {
      height: 56px;
    }
  }
`;

const StyledNavLink = styled(NavLink)<{ $active?: boolean; $emphasis?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  color: ${({ $active }) => ($active ? 'var(--nav-active)' : 'var(--nav-muted)')};
  font-size: 13.5px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  letter-spacing: 0.01em;
  line-height: 1;
  text-transform: none;
  white-space: nowrap;
  transition: color 200ms ${EASE};

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: var(--nav-mark);
    content: '';
    opacity: ${({ $active }) => ($active ? 0.9 : 0)};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0.35)});
    transform-origin: center;
    transition:
      opacity 200ms ${EASE},
      transform 200ms ${EASE};
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 0.9;
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: none;
    color: var(--nav-hover);
  }

  ${({ $emphasis }) =>
    $emphasis
      ? `
    margin-left: 4px;
    padding-left: 18px;
    color: inherit;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 1px;
      height: 12px;
      background: var(--nav-line);
      content: '';
      transform: translateY(-50%);
    }
  `
      : ''}
`;

const LinkArrow = styled.span`
  display: inline-grid;
  place-items: center;
  width: 10px;
  height: 10px;

  svg {
    width: 100%;
    height: 100%;
    transition: transform 200ms ${EASE};
  }

  ${StyledNavLink}:hover & svg,
  ${StyledNavLink}:focus-visible & svg {
    transform: translate(1.5px, -1.5px);
  }
`;

const LangDivider = styled.span`
  color: rgba(245, 245, 240, 0.22);
  font-size: 10px;
  letter-spacing: 0;
`;

const LangButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : 'rgba(245, 245, 240, 0.32)'};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 200ms ${EASE}, transform 140ms ${EASE};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.ice};
    outline: none;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const MenuButton = styled.button<{ $open: boolean }>`
  position: relative;
  z-index: 3;
  display: none;
  width: 44px;
  height: 44px;
  place-items: center;
  background: transparent;
  color: ${({ $open, theme }) => ($open ? theme.colors.white : 'inherit')};
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  transition: opacity 200ms ${EASE}, transform 140ms ${EASE};

  &:hover,
  &:focus-visible {
    opacity: 0.7;
    outline: none;
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 980px) {
    display: grid;
  }
`;

const MenuLines = styled.span<{ $open: boolean }>`
  position: relative;
  width: 22px;
  height: 10px;

  &::before,
  &::after {
    position: absolute;
    left: 0;
    width: 22px;
    height: 1px;
    background: currentColor;
    content: '';
    transition:
      top 220ms ${EASE},
      transform 220ms ${EASE};
  }

  &::before {
    top: ${({ $open }) => ($open ? '4.5px' : '0')};
    transform: ${({ $open }) => ($open ? 'rotate(45deg)' : 'none')};
  }

  &::after {
    top: ${({ $open }) => ($open ? '4.5px' : '10px')};
    transform: ${({ $open }) => ($open ? 'rotate(-45deg)' : 'none')};
  }
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1;
  display: none;
  visibility: hidden;
  flex-direction: column;
  justify-content: safe flex-end;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding:
    calc(112px + env(safe-area-inset-top, 0px))
    ${({ theme }) => theme.spacing.pageX}
    calc(28px + env(safe-area-inset-bottom, 0px));
  background:
    radial-gradient(circle at 70% 12%, rgba(26, 47, 160, 0.38), transparent 42vw),
    rgba(5, 6, 15, 0.97);
  backdrop-filter: blur(24px);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 320ms ${EASE},
    visibility 320ms ${EASE};

  @media (max-width: 980px) {
    display: flex;
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  }
`;

const MobileNav = styled.nav`
  display: grid;
  width: 100%;
  gap: clamp(8px, 1.4vh, 16px);
`;

const MobileNavLink = styled(NavLink)`
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: baseline;
  column-gap: 12px;
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(34px, 9vw, 52px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 0.96;
  text-transform: none;
  transform: translateY(16px);
  opacity: 0;
  transition: color 200ms ${EASE};

  span {
    color: rgba(203, 223, 238, 0.55);
    font-size: 11px;
    font-weight: ${({ theme }) => theme.typography.weights.regular};
    letter-spacing: 0.14em;
    line-height: 1;
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.ice};
    outline: none;
  }
`;

const MobileLangRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

type NavItem = { key: NavKey; to: string };

function sectionIdFromPath(to: string) {
  if (to.startsWith('/#')) return to.slice(2);
  if (to === '/blog') return 'blog';
  if (to === '/projekty' || to === '/projects') return 'projects';
  if (to === '/prodej') return 'sale';
  if (to === '/pronajem') return 'rent';
  if (to === '/kupujeme') return 'weBuy';
  return '';
}

function NavLinks({
  links,
  getNavLinkProps,
  labels,
  activeId,
}: {
  links: readonly NavItem[];
  getNavLinkProps: (to: string) => {
    to: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  };
  labels: Record<NavKey, string>;
  activeId: string;
}) {
  return (
    <>
      {links.map((link) => {
        const sectionId = sectionIdFromPath(link.to);
        const isActive =
          activeId === sectionId ||
          (link.to === '/blog' && activeId === 'blog') ||
          (link.to === '/projekty' && activeId === 'projects') ||
          (link.to === '/prodej' && activeId === 'sale') ||
          (link.to === '/pronajem' && activeId === 'rent') ||
          (link.to === '/kupujeme' && activeId === 'weBuy');
        const linkProps = getNavLinkProps(link.to);
        const isContact = link.key === 'contact';

        return (
          <StyledNavLink
            $active={isActive}
            $emphasis={isContact}
            className="hoverable"
            key={link.to}
            to={linkProps.to}
            onClick={linkProps.onClick}
          >
            {labels[link.key]}
            {isContact ? (
              <LinkArrow aria-hidden>
                <svg fill="none" viewBox="0 0 10 10">
                  <path
                    d="M2 8L8 2M8 2H3.5M8 2V6.5"
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeWidth="1"
                  />
                </svg>
              </LinkArrow>
            ) : null}
          </StyledNavLink>
        );
      })}
    </>
  );
}

export function Navbar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { locale, setLocale, t } = useLanguage();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('');
  const location = useLocation();
  const isLight = tone === 'light';

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/blog')) {
      setActiveId('blog');
    } else if (location.pathname.startsWith('/projekty') || location.pathname.startsWith('/projects')) {
      setActiveId('projects');
    } else if (location.pathname.startsWith('/prodej')) {
      setActiveId('sale');
    } else if (location.pathname.startsWith('/pronajem')) {
      setActiveId('rent');
    } else if (location.pathname.startsWith('/kupujeme')) {
      setActiveId('weBuy');
    }

    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }

    const sectionIds = ['projects', 'sold', 'sell-with-us', 'about', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-28% 0px -48% 0px',
        threshold: [0.08, 0.2, 0.4],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    document.body.style.overflow = isOpen ? 'hidden' : '';

    const links = menu.querySelectorAll('a');

    if (isOpen && prefersReducedMotion()) {
      gsap.set(links, { autoAlpha: 1, y: 0 });
    } else if (isOpen) {
      gsap.fromTo(
        links,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 },
      );
    } else {
      gsap.set(links, { autoAlpha: 0, y: 16 });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const getNavLinkProps = (to: string) => {
    if (to.startsWith('/#')) {
      return {
        to,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => {
          if (location.pathname !== '/') return;
          event.preventDefault();
          document.getElementById(to.replace('/#', ''))?.scrollIntoView({ behavior: 'smooth' });
          closeMenu();
        },
      };
    }

    return { to };
  };

  return (
    <Header $light={isLight} $scrolled={scrolled}>
      <Bar>
        <SideNav $align="left" aria-label="Primary navigation left">
          <NavLinks
            activeId={activeId}
            getNavLinkProps={getNavLinkProps}
            labels={t.nav}
            links={LEFT_LINK_KEYS}
          />
        </SideNav>

        <LogoWrap $light={isLight && !isOpen} aria-label={t.common.homeLabel} className="hoverable" to="/">
          <OurenLogo />
        </LogoWrap>

        <SideNav $align="right" aria-label="Primary navigation right">
          <NavLinks
            activeId={activeId}
            getNavLinkProps={getNavLinkProps}
            labels={t.nav}
            links={RIGHT_LINK_KEYS}
          />
        </SideNav>

        <MenuButton
          $open={isOpen}
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? t.common.closeMenu : t.common.openMenu}
          className="hoverable"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <MenuLines $open={isOpen} />
        </MenuButton>
      </Bar>

      <MobileMenu $open={isOpen} id="mobile-menu" ref={mobileMenuRef}>
        <MobileNav aria-label="Mobile navigation">
          {NAV_LINK_KEYS.map((link, index) => {
            const linkProps = getNavLinkProps(link.to);

            return (
              <MobileNavLink
                className="hoverable"
                key={link.to}
                to={linkProps.to}
                onClick={(event) => {
                  linkProps.onClick?.(event);
                  closeMenu();
                }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {t.nav[link.key]}
              </MobileNavLink>
            );
          })}
          <MobileLangRow>
            <LangButton
              $active={locale === 'cs'}
              aria-pressed={locale === 'cs'}
              className="hoverable"
              type="button"
              onClick={() => {
                setLocale('cs');
                closeMenu();
              }}
            >
              CZ
            </LangButton>
            <LangDivider aria-hidden>/</LangDivider>
            <LangButton
              $active={locale === 'en'}
              aria-pressed={locale === 'en'}
              className="hoverable"
              type="button"
              onClick={() => {
                setLocale('en');
                closeMenu();
              }}
            >
              EN
            </LangButton>
          </MobileLangRow>
        </MobileNav>
      </MobileMenu>
    </Header>
  );
}
