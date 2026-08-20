import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';

const Wrap = styled.main`
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: clamp(120px, 18vw, 180px) ${({ theme }) => theme.spacing.pageX} 80px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.typography.display};
  font-size: clamp(28px, 4vw, 42px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: 0.04em;
`;

const Copy = styled.p`
  max-width: 38rem;
  margin: 0 auto 28px;
  color: rgba(245, 245, 240, 0.65);
  font-size: 15px;
  line-height: 1.6;
`;

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export default function AdminPortalPage() {
  const { t } = useLanguage();

  return (
    <Wrap>
      <PageMeta description={t.portal.metaDescription} title={t.portal.metaTitle} />
      <Title>{t.portal.title}</Title>
      <Copy>{t.portal.copy}</Copy>
      <HomeLink to="/">{t.portal.backHome}</HomeLink>
    </Wrap>
  );
}
