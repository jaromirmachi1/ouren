import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { BlogCard } from '../components/blog/BlogCard';
import { Footer } from '../components/layout/Footer';
import { GradientBlob } from '../components/ui/GradientBlob';
import { blogPosts } from '../data/blog';
import { PageMeta } from '../seo/PageMeta';
import { prefersReducedMotion } from '../utils/performance';
import { refreshScrollTriggers, revealOnScroll } from '../utils/scrollReveal';

const Page = styled.main`
  position: relative;
  overflow: clip;
`;

const Hero = styled.section`
  position: relative;
  display: grid;
  align-content: end;
  min-height: 72vh;
  padding: clamp(140px, 18vh, 200px) ${({ theme }) => theme.spacing.pageX} clamp(48px, 8vh, 80px);
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 40%, rgba(26, 47, 160, 0.5) 0%, transparent 48%),
    radial-gradient(circle at 50% 35%, ${({ theme }) => theme.colors.navy} 0%, transparent 60%),
    ${({ theme }) => theme.colors.deepBlack};
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 14ch;
  margin-top: 16px;
  font-size: clamp(48px, 7vw, 96px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
  line-height: 0.95;
`;

const Lead = styled.p`
  max-width: 52ch;
  margin-top: clamp(20px, 3vw, 32px);
  color: rgba(245, 245, 240, 0.7);
  font-size: clamp(16px, 1.6vw, 18px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: ${({ theme }) => theme.typography.leading.body};
`;

const Content = styled.section`
  padding: ${({ theme }) => theme.spacing.sectionY} ${({ theme }) => theme.spacing.pageX};
`;

const Grid = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 32px);

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Featured = styled.div`
  margin-bottom: clamp(24px, 4vw, 40px);

  @media (min-width: 1200px) {
    grid-column: span 2;
  }
`;

export default function BlogPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [featured, ...rest] = blogPosts;

  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) {
      return;
    }

    const cards = grid.querySelectorAll('.blog-card');
    const context = revealOnScroll(grid, cards, { y: 50, duration: 0.85, stagger: 0.1 });

    refreshScrollTriggers();

    return () => {
      context.revert();
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const heroLines = document.querySelectorAll('[data-blog-hero]');

    gsap.fromTo(
      heroLines,
      { y: 60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, immediateRender: false },
    );
  }, []);

  return (
    <Page>
      <PageMeta
        description="Editorial insights on luxury real estate, design, investment, and market intelligence from Ouren."
        title="Journal | Ouren Real Estate"
      />
      <Hero>
        <GradientBlob color="rgba(26, 47, 160, 0.8)" left="50%" opacity={0.65} size="clamp(400px, 58vw, 820px)" top="20%" />
        <div>
          <Eyebrow data-blog-hero>Journal</Eyebrow>
          <Title data-blog-hero>Insights on place, design, and value.</Title>
          <Lead data-blog-hero>
            Perspectives from our team on markets, architecture, and the craft of placing exceptional properties.
          </Lead>
        </div>
      </Hero>
      <Content>
        <Grid ref={gridRef}>
          {featured && (
            <Featured>
              <BlogCard index={0} post={featured} />
            </Featured>
          )}
          {rest.map((post, index) => (
            <BlogCard index={index + 1} key={post.id} post={post} />
          ))}
        </Grid>
      </Content>
      <Footer />
    </Page>
  );
}
