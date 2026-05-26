import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

const PROPERTY_ITEMS: FlowingMenuItem[] = [
  {
    link: '/#projects',
    text: 'Flats',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    link: '/#projects',
    text: 'Houses',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    link: '/#projects',
    text: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    link: '/#projects',
    text: 'Others',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
];

export function PropertyMenu() {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate('/#projects');
    window.setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  return (
    <Section aria-labelledby="property-menu-label" id="property-types">
      <Header>
        <Eyebrow id="property-menu-label">Browse by type</Eyebrow>
      </Header>
      <MenuFill>
        <FlowingMenu
          bgColor={theme.colors.deepBlack}
          borderColor="rgba(255, 255, 255, 0.1)"
          items={PROPERTY_ITEMS}
          marqueeBgColor={theme.colors.navy}
          marqueeTextColor={theme.colors.white}
          onItemClick={handleItemClick}
          speed={12}
          textColor={theme.colors.white}
        />
      </MenuFill>
    </Section>
  );
}
