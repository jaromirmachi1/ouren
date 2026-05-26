import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';

const Section = styled.section`
  padding: clamp(56px, 8vw, 96px) ${({ theme }) => theme.spacing.pageX};
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const Grid = styled.div`
  display: grid;
  gap: 28px;

  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr;
    align-items: end;
  }
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.colors.gold};
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const Headline = styled.h2`
  margin-top: 12px;
  font-size: clamp(32px, 4vw, 52px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
`;

const Copy = styled.p`
  color: rgba(245, 245, 240, 0.7);
  font-size: ${({ theme }) => theme.typography.scale.body};
  line-height: ${({ theme }) => theme.typography.leading.body};
`;

const Details = styled.div`
  display: grid;
  gap: 12px;
`;

const Link = styled.a`
  color: ${({ theme }) => theme.colors.white};
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
`;

export function Contact() {
  const { t } = useLanguage();

  return (
    <Section id="contact">
      <Grid>
        <div>
          <Eyebrow>{t.contact.eyebrow}</Eyebrow>
          <Headline>{t.contact.headline}</Headline>
          <Copy>{t.contact.copy}</Copy>
        </div>
        <Details>
          <Link className="hoverable" href="mailto:hello@ouren.cz">
            hello@ouren.cz
          </Link>
          <Link className="hoverable" href="tel:+420123456789">
            +420 123 456 789
          </Link>
          <Copy>{t.contact.locations}</Copy>
        </Details>
      </Grid>
    </Section>
  );
}
