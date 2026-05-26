import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
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
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.replace('#', '');
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <Page>
      <PageMeta
        description="Ouren is a Czech-based international real estate developer and brokerage for premium residential and commercial properties."
        title="Ouren Real Estate | We build. We place. We elevate."
      />
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
