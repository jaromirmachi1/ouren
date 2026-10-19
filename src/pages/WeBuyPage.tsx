import styled from 'styled-components';
import { Footer } from '../components/layout/Footer';
import { SellWithUs } from '../components/sections/SellWithUs';
import { useLanguage } from '../i18n/LanguageContext';
import { PageMeta } from '../seo/PageMeta';

const Page = styled.main`
  min-height: 100dvh;
  background:
    radial-gradient(circle at 18% 0%, rgba(203, 223, 238, 0.5), transparent 40%),
    ${({ theme }) => theme.colors.brightBg};
  color: ${({ theme }) => theme.colors.brightInk};
`;

const Hero = styled.header`
  padding: clamp(140px, 18vh, 180px) ${({ theme }) => theme.spacing.pageX} clamp(28px, 4vw, 48px);
`;

const Title = styled.h1`
  max-width: 14ch;
  font-size: clamp(48px, 8vw, 96px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: -0.03em;
  line-height: 0.92;
`;

const Lead = styled.p`
  max-width: 44ch;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.brightMuted};
  font-size: clamp(16px, 1.8vw, 19px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.55;
`;

const BrightFooter = styled.div`
  footer {
    background: ${({ theme }) => theme.colors.brightBg};
    color: ${({ theme }) => theme.colors.brightInk};
  }

  footer a,
  footer button {
    color: ${({ theme }) => theme.colors.brightInk};
  }

  footer p {
    color: ${({ theme }) => theme.colors.brightMuted};
  }
`;

export default function WeBuyPage() {
  const { locale, t } = useLanguage();

  return (
    <Page>
      <PageMeta
        description={t.meta.weBuyDescription}
        lang={locale}
        path="/kupujeme"
        title={t.meta.weBuyTitle}
      />
      <Hero>
        <Title>{t.listings.weBuyTitle}</Title>
        <Lead>{t.listings.weBuyLead}</Lead>
      </Hero>
      <SellWithUs />
      <BrightFooter>
        <Footer />
      </BrightFooter>
    </Page>
  );
}
