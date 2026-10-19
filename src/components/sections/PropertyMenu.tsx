import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import flatsImage from '../../assets/images/IMG_3434.jpg';
import { loadActiveProjects, loadSoldProjects } from '../../data/projects-source';
import { useLanguage } from '../../i18n/LanguageContext';
import type { PropertyTypeKey } from '../../i18n/types';
import type { Project } from '../../types';
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

const Title = styled.p`
  color: ${({ theme: t }) => t.colors.ice};
  font-size: ${({ theme: t }) => t.typography.scale.label};
  letter-spacing: ${({ theme: t }) => t.typography.tracking.label};
  text-transform: uppercase;
`;

/** Owned category stills — drop more files here as you shoot them. */
const OWNED_CATEGORY_IMAGES: Partial<Record<PropertyTypeKey, string>> = {
  flats: flatsImage,
};

const PROPERTY_KEYS: PropertyTypeKey[] = ['flats', 'houses', 'commercial', 'others'];

const KEY_TO_PROJECT_TYPE: Record<PropertyTypeKey, Project['type'] | null> = {
  flats: 'apartment',
  houses: 'house',
  commercial: 'commercial',
  others: null,
};

function isStockPhoto(url: string) {
  return url.includes('images.unsplash.com');
}

function projectPhotos(project: Project) {
  return [project.image, ...(project.gallery ?? [])].filter(Boolean);
}

function pickCategoryImage(key: PropertyTypeKey, projects: Project[]) {
  const owned = OWNED_CATEGORY_IMAGES[key];
  if (owned) return owned;

  const type = KEY_TO_PROJECT_TYPE[key];
  const pool = type ? projects.filter((project) => project.type === type) : projects;
  const ownedPhoto = pool.flatMap(projectPhotos).find((url) => !isStockPhoto(url));
  if (ownedPhoto) return ownedPhoto;

  const anyPhoto = pool.flatMap(projectPhotos)[0];
  return anyPhoto || flatsImage;
}

export function PropertyMenu() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadActiveProjects(), loadSoldProjects()]).then(([active, sold]) => {
      if (!cancelled) setProjects([...active, ...sold]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo<FlowingMenuItem[]>(
    () =>
      PROPERTY_KEYS.map((key) => ({
        link: '/projekty',
        text: t.propertyMenu.types[key],
        image: pickCategoryImage(key, projects),
      })),
    [projects, t],
  );

  const handleItemClick = () => {
    navigate('/projekty');
  };

  return (
    <Section aria-labelledby="property-menu-label" id="property-types">
      <Header>
        <Title id="property-menu-label">{t.propertyMenu.title}</Title>
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
