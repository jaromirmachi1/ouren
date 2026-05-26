import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { PropertyTypeKey } from '../../i18n/types';
import { FlowingMenu, type FlowingMenuItem } from '../ui/FlowingMenu';
import { theme } from '../../styles/theme';

const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: clamp(900px, 100vh, 1120px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const MenuFill = styled.div`
  flex: 1;
  min-height: 0;
`;

const Header = styled.div`
  position: absolute;
  top: clamp(24px, 4vh, 40px);
  left: ${({ theme: t }) => t.spacing.pageX};
  z-index: 2;
  pointer-events: none;
`;

const Eyebrow = styled.p`
  color: ${({ theme: t }) => t.colors.gold};
  font-size: ${({ theme: t }) => t.typography.scale.label};
  letter-spacing: ${({ theme: t }) => t.typography.tracking.label};
  text-transform: uppercase;
`;

const PROPERTY_IMAGES: Record<PropertyTypeKey, string> = {
  flats: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  houses: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  others: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
};

const PROPERTY_KEYS: PropertyTypeKey[] = ['flats', 'houses', 'commercial', 'others'];

export function PropertyMenu() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const items = useMemo<FlowingMenuItem[]>(
    () =>
      PROPERTY_KEYS.map((key) => ({
        link: '/#projects',
        text: t.propertyMenu.types[key],
        image: PROPERTY_IMAGES[key],
      })),
    [t],
  );

  const handleItemClick = () => {
    navigate('/#projects');
    window.setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <Section aria-labelledby="property-menu-label" id="property-types">
      <Header>
        <Eyebrow id="property-menu-label">{t.propertyMenu.eyebrow}</Eyebrow>
      </Header>
      <MenuFill>
        <FlowingMenu
          bgColor={theme.colors.deepBlack}
          borderColor="rgba(255, 255, 255, 0.1)"
          items={items}
          marqueeBgColor={theme.colors.highlight}
          marqueeTextColor={theme.colors.deepBlack}
          onItemClick={handleItemClick}
          speed={12}
          textColor={theme.colors.white}
        />
      </MenuFill>
    </Section>
  );
}
