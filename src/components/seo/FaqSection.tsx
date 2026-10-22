import styled from 'styled-components';
import type { FaqItem } from '../../i18n/types';
import { JsonLd } from '../../seo/JsonLd';
import { faqPageJsonLd } from '../../seo/schema';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const Section = styled.section<{ $dark?: boolean }>`
  padding: clamp(72px, 9vw, 120px) ${({ theme }) => theme.spacing.pageX}
    clamp(80px, 10vw, 128px);
  border-top: 1px solid
    ${({ $dark }) => ($dark ? 'rgba(245, 245, 240, 0.12)' : 'rgba(5, 6, 15, 0.12)')};
  color: ${({ $dark, theme }) => ($dark ? theme.colors.white : theme.colors.brightInk)};
`;

const Title = styled.h2`
  max-width: 16ch;
  margin-bottom: clamp(28px, 4vw, 40px);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-wrap: balance;
`;

const List = styled.div<{ $dark?: boolean }>`
  border-top: 1px solid
    ${({ $dark }) => ($dark ? 'rgba(245, 245, 240, 0.12)' : 'rgba(5, 6, 15, 0.12)')};
`;

const Item = styled.details<{ $dark?: boolean }>`
  border-bottom: 1px solid
    ${({ $dark }) => ($dark ? 'rgba(245, 245, 240, 0.12)' : 'rgba(5, 6, 15, 0.12)')};

  summary {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 22px 0;
    font-size: clamp(17px, 1.8vw, 22px);
    font-weight: ${({ theme }) => theme.typography.weights.light};
    letter-spacing: -0.02em;
    cursor: pointer;
    list-style: none;
    transition: opacity 180ms ${EASE};

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: '+';
      flex: none;
      color: ${({ $dark, theme }) => ($dark ? theme.colors.ice : theme.colors.navy)};
      font-size: 22px;
      line-height: 1;
      transition: transform 220ms ${EASE};
    }

    &:hover {
      opacity: 0.72;
    }

    &:focus-visible {
      outline: 2px solid ${({ $dark, theme }) => ($dark ? theme.colors.ice : theme.colors.navy)};
      outline-offset: 4px;
    }
  }

  &[open] summary::after {
    transform: rotate(45deg);
  }
`;

const Answer = styled.div`
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 240ms ${EASE};

  ${Item}[open] & {
    grid-template-rows: 1fr;
  }
`;

const AnswerText = styled.p<{ $dark?: boolean }>`
  overflow: hidden;
  max-width: 62ch;
  margin: 0;
  color: ${({ $dark, theme }) =>
    $dark ? 'rgba(245, 245, 240, 0.72)' : theme.colors.brightMuted};
  font-size: 16px;
  line-height: 1.6;

  ${Item}[open] & {
    padding-bottom: 22px;
  }
`;

type FaqSectionProps = {
  id: string;
  title: string;
  items: readonly FaqItem[];
  tone?: 'bright' | 'dark';
};

export function FaqSection({ id, title, items, tone = 'bright' }: FaqSectionProps) {
  const dark = tone === 'dark';

  return (
    <Section $dark={dark} aria-labelledby={id}>
      <JsonLd data={faqPageJsonLd([...items])} id={id} />
      <Title id={id}>{title}</Title>
      <List $dark={dark}>
        {items.map((item) => (
          <Item $dark={dark} key={item.q}>
            <summary>{item.q}</summary>
            <Answer>
              <AnswerText $dark={dark}>{item.a}</AnswerText>
            </Answer>
          </Item>
        ))}
      </List>
    </Section>
  );
}
