import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate, formatReadTime } from '../../i18n/format';
import type { BlogPost } from '../../types';

type BlogCardProps = {
  post: BlogPost;
  index: number;
};

const Card = styled(Link)`
  position: relative;
  display: grid;
  overflow: hidden;
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  background: ${({ theme }) => theme.colors.card};
  transition: border-color 0.4s ease;

  &:hover {
    border-color: rgba(203, 223, 238, 0.45);
  }
`;

const Media = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Body = styled.div`
  display: grid;
  gap: 14px;
  padding: clamp(20px, 3vw, 28px);
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const Category = styled.span`
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Published = styled.span`
  color: rgba(245, 245, 240, 0.5);
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-size: clamp(22px, 2.6vw, 32px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  line-height: 1.05;
`;

const Excerpt = styled.p`
  color: rgba(245, 245, 240, 0.68);
  font-size: 15px;
  line-height: 1.7;
`;

const Footer = styled.p`
  color: rgba(245, 245, 240, 0.45);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export function BlogCard({ post, index }: BlogCardProps) {
  const { locale, t } = useLanguage();

  return (
    <Card
      className="hoverable blog-card"
      data-cursor-label={String(index + 1).padStart(2, '0')}
      to={`/blog/${post.slug}`}
    >
      <Media>
        <Image alt={post.title} loading="lazy" src={post.image} />
      </Media>
      <Body>
        <Meta>
          <Category>{t.blog.categories[post.category]}</Category>
          <Published>{formatDate(post.publishedAt, locale)}</Published>
        </Meta>
        <Title>{post.title}</Title>
        <Excerpt>{post.excerpt}</Excerpt>
        <Footer>
          {formatReadTime(post.readTime, locale)} · {post.author}
        </Footer>
      </Body>
    </Card>
  );
}
