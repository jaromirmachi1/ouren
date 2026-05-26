import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../i18n/LanguageContext';
import { refreshScrollTriggers } from '../utils/scrollReveal';
import { Footer } from '../components/layout/Footer';
import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { Hero } from '../components/sections/Hero';
import { PropertyMenu } from '../components/sections/PropertyMenu';
import { Projects } from '../components/sections/Projects';
import { SellWithUs } from '../components/sections/SellWithUs';
import { SoldProjects } from '../components/sections/SoldProjects';
import { PageMeta } from '../seo/PageMeta';

const Page = styled.main`
  position: relative;
  overflow: clip;
`;

export default function HomePage() {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.replace('#', '');
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      refreshScrollTriggers();
    }, 400);

    const refreshTimer = window.setTimeout(refreshScrollTriggers, 900);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(refreshTimer);
    };
  }, [location.hash]);

  useEffect(() => {
    refreshScrollTriggers();
  }, []);

  return (
    <Page>
      <PageMeta description={t.meta.homeDescription} title={t.meta.homeTitle} />
      <Hero />
      <PropertyMenu />
      <Projects />
      <SoldProjects />
      <SellWithUs />
      <About />
      <Contact />
      <Footer />
    </Page>
  );
}
