import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import styled from 'styled-components';
import { Footer } from '../components/layout/Footer';
import { GradientBlob } from '../components/ui/GradientBlob';
import { GrainOverlay } from '../components/ui/GrainOverlay';
import { getBlogPost } from '../data/blog';
import { PageMeta } from '../seo/PageMeta';

const Page = styled.main`
  position: relative;
  overflow: clip;
`;

const Hero = styled.header`
  position: relative;
  padding: clamp(140px, 18vh, 200px) ${({ theme }) => theme.spacing.pageX} clamp(40px, 6vh, 64px);
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 30%, rgba(26, 47, 160, 0.45), transparent 50%),
    ${({ theme }) => theme.colors.deepBlack};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: clamp(28px, 4vw, 40px);
  color: rgba(245, 245, 240, 0.55);
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  max-width: 18ch;
  margin-top: 20px;
  font-size: clamp(40px, 5.5vw, 72px);
  font-weight: ${({ theme }) => theme.typography.weights.extraLight};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
  line-height: 0.98;
`;

const Cover = styled.div`
  position: relative;
  margin: 0 ${({ theme }) => theme.spacing.pageX};
  overflow: hidden;
  aspect-ratio: 21 / 9;
  border: 0.5px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 760px) {
    aspect-ratio: 4 / 3;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Article = styled.article`
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(48px, 8vw, 96px) ${({ theme }) => theme.spacing.pageX};
`;

const Lead = styled.p`
  color: rgba(245, 245, 240, 0.82);
  font-size: clamp(18px, 2vw, 22px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.65;
`;

const Paragraph = styled.p`
  margin-top: 28px;
  color: rgba(245, 245, 240, 0.72);
  font-size: ${({ theme }) => theme.typography.scale.body};
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: ${({ theme }) => theme.typography.leading.body};
`;

const categoryLabels = {
  market: 'Market',
  design: 'Design',
  investment: 'Investment',
  lifestyle: 'Lifestyle',
} as const;

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!articleRef.current) {
      return;
    }

    gsap.from(articleRef.current.children, {
      y: 32,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
    });
  }, [slug]);

  if (!post) {
    return <Navigate replace to="/blog" />;
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Page>
      <PageMeta description={post.excerpt} title={`${post.title} | Ouren Journal`} />
      <Hero>
        <GrainOverlay opacity={0.05} />
        <GradientBlob color="rgba(26, 47, 160, 0.65)" left="70%" opacity={0.5} size="clamp(280px, 40vw, 520px)" top="10%" />
        <BackLink className="hoverable" to="/blog">
          ← Back to journal
        </BackLink>
        <Meta>
          <span>{categoryLabels[post.category]}</span>
          <span>{formattedDate}</span>
          <span>{post.readTime} min read</span>
        </Meta>
        <Title>{post.title}</Title>
      </Hero>
      <Cover>
        <CoverImage alt={post.title} loading="lazy" src={post.image} />
      </Cover>
      <Article ref={articleRef}>
        <Lead>{post.excerpt}</Lead>
        {post.content.map((paragraph) => (
          <Paragraph key={paragraph.slice(0, 24)}>{paragraph}</Paragraph>
        ))}
      </Article>
      <Footer />
    </Page>
  );
}
