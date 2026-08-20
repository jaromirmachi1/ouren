import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { NavKey } from '../../i18n/types';
import { OurenLogo } from '../ui/OurenLogo';

const LEFT_LINK_KEYS = [
  { key: 'projects' as const, to: '/#projects' },
  { key: 'sold' as const, to: '/#sold' },
  { key: 'about' as const, to: '/#about' },
];

const RIGHT_LINK_KEYS = [
  { key: 'sellWithUs' as const, to: '/#sell-with-us' },
  { key: 'journal' as const, to: '/blog' },
  { key: 'contact' as const, to: '/#contact' },
];

const NAV_LINK_KEYS = [...LEFT_LINK_KEYS, ...RIGHT_LINK_KEYS];

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.nav};
  width: 100%;
  padding: clamp(16px, 2.5vh, 28px) ${({ theme }) => theme.spacing.pageX};
  color: ${({ theme }) => theme.colors.white};
`;

const Bar = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: clamp(72px, 10vh, 96px);
  padding: 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr auto;
    min-height: 64px;
  }
`;

const SideNav = styled.nav<{ $align: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  gap: clamp(28px, 4vw, 56px);
  justify-content: ${({ $align }) => ($align === 'left' ? 'flex-start' : 'flex-end')};
  grid-column: ${({ $align }) => ($align === 'left' ? 1 : 3)};
  grid-row: 1;

  @media (max-width: 900px) {
    display: none;
  }
`;

const LogoWrap = styled(Link)`
  position: relative;
  z-index: 2;
  display: inline-flex;
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  align-items: center;

  img {
    height: clamp(64px, 9vw, 96px);
    width: auto;
  }

  @media (max-width: 900px) {
    grid-column: 1 / -1;
    justify-self: center;
  }
`;

const StyledNavLink = styled(NavLink)`
  position: relative;
  display: inline-flex;
  padding: 8px 0;
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  letter-spacing: ${({ theme }) => theme.typography.tracking.nav};
  line-height: 1;
  text-transform: uppercase;
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.45);
  transition: color 0.25s ease, opacity 0.25s ease;
  white-space: nowrap;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.gold};
    content: '';
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.85;
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }
`;

const LangRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LangButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.white : 'rgba(245, 245, 240, 0.88)')};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.4);
`;

const MenuButton = styled.button`
  position: relative;
  z-index: 3;
  display: none;
  width: 44px;
  height: 44px;
  place-items: center;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  grid-column: 2;
  grid-row: 1;
  justify-self: end;

  @media (max-width: 900px) {
    display: grid;
  }
`;

const MenuLines = styled.span<{ $open: boolean }>`
  position: relative;
  width: 24px;
  height: 14px;

  &::before,
  &::after {
    position: absolute;
    left: 0;
    width: 24px;
    height: 1px;
    background: currentColor;
    content: '';
    transition:
      top 0.3s ease,
      transform 0.3s ease;
  }

  &::before {
    top: ${({ $open }) => ($open ? '7px' : '2px')};
    transform: ${({ $open }) => ($open ? 'rotate(45deg)' : 'rotate(0)')};
  }

  &::after {
    top: ${({ $open }) => ($open ? '7px' : '12px')};
    transform: ${({ $open }) => ($open ? 'rotate(-45deg)' : 'rotate(0)')};
  }
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.nav - 1};
  display: none;
  visibility: hidden;
  align-items: end;
  padding: 120px ${({ theme }) => theme.spacing.pageX} 48px;
  background:
    radial-gradient(circle at 50% 18%, rgba(26, 47, 160, 0.52), transparent 52vw),
    rgba(5, 6, 15, 0.96);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease, visibility 0.35s ease;

  @media (max-width: 900px) {
    display: flex;
    visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  }
`;

const MobileNav = styled.nav`
  display: grid;
  width: 100%;
  gap: 22px;
`;

const MobileNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(38px, 13vw, 72px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
  line-height: 0.96;
  text-transform: uppercase;
  transform: translateY(28px);
  opacity: 0;

  span {
    display: block;
    color: ${({ theme }) => theme.colors.gold};
    font-size: ${({ theme }) => theme.typography.scale.label};
    font-weight: ${({ theme }) => theme.typography.weights.regular};
    letter-spacing: ${({ theme }) => theme.typography.tracking.label};
    line-height: 1;
    margin-bottom: 10px;
  }
`;

type NavItem = { key: NavKey; to: string };

function NavLinks({
  links,
  getNavLinkProps,
  labels,
}: {
  links: readonly NavItem[];
  getNavLinkProps: (to: string) => ReturnType<typeof Object>;
  labels: Record<NavKey, string>;
}) {
  return (
    <>
      {links.map((link) => (
        <StyledNavLink className="hoverable" key={link.to} {...getNavLinkProps(link.to)}>
          {labels[link.key]}
        </StyledNavLink>
      ))}
    </>
  );
}

export function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const menu = mobileMenuRef.current;

    if (!menu) {
      return;
    }

    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      gsap.fromTo(
        menu.querySelectorAll('a'),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
      );
    } else {
      gsap.set(menu.querySelectorAll('a'), { autoAlpha: 0, y: 28 });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  const getNavLinkProps = (to: string) => {
    const linkProps = { to, isActive: () => false };

    if (to.startsWith('/#')) {
      return {
        ...linkProps,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => {
          if (location.pathname !== '/') {
            return;
          }
          event.preventDefault();
          const id = to.replace('/#', '');
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          closeMenu();
        },
      };
    }

    return linkProps;
  };

  return (
    <Header>
      <Bar>
        <SideNav $align="left" aria-label="Primary navigation left">
          <NavLinks getNavLinkProps={getNavLinkProps} labels={t.nav} links={LEFT_LINK_KEYS} />
        </SideNav>

        <LogoWrap aria-label={t.common.homeLabel} className="hoverable" to="/">
          <OurenLogo />
        </LogoWrap>

        <SideNav $align="right" aria-label="Primary navigation right">
          <NavLinks getNavLinkProps={getNavLinkProps} labels={t.nav} links={RIGHT_LINK_KEYS} />
          <LangRow>
            <LangButton $active={locale === 'cs'} className="hoverable" type="button" onClick={() => setLocale('cs')}>
              CZ
            </LangButton>
            <LangButton $active={locale === 'en'} className="hoverable" type="button" onClick={() => setLocale('en')}>
              EN
            </LangButton>
          </LangRow>
        </SideNav>

        <MenuButton
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
          {NAV_LINK_KEYS.map((link, index) => (
            <MobileNavLink
              className="hoverable"
              key={link.to}
              onClick={closeMenu}
              {...getNavLinkProps(link.to)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {t.nav[link.key]}
            </MobileNavLink>
          ))}
          <LangRow>
            <LangButton $active={locale === 'cs'} className="hoverable" type="button" onClick={() => { setLocale('cs'); closeMenu(); }}>
              CZ
            </LangButton>
            <LangButton $active={locale === 'en'} className="hoverable" type="button" onClick={() => { setLocale('en'); closeMenu(); }}>
              EN
            </LangButton>
          </LangRow>
        </MobileNav>
      </MobileMenu>
    </Header>
  );
}
