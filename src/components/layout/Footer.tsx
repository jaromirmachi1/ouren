import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { NavKey } from '../../i18n/types';
import { OurenLogo } from '../ui/OurenLogo';

const FooterWrap = styled.footer`
  position: relative;
  padding: clamp(72px, 10vw, 120px) ${({ theme }) => theme.spacing.pageX} 32px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.deepBlack};
`;

const Watermark = styled.div`
  position: absolute;
  top: clamp(24px, 4vw, 48px);
  left: 50%;
  opacity: 0.06;
  pointer-events: none;
  transform: translateX(-50%);

  img {
    height: clamp(120px, 20vw, 240px);
    width: auto;
  }
`;

const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 40px;

  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Column = styled.div`
  display: grid;
  gap: 14px;
`;

const Label = styled.p`
  color: rgba(245, 245, 240, 0.55);
  font-size: ${({ theme }) => theme.typography.scale.label};
  letter-spacing: ${({ theme }) => theme.typography.tracking.label};
  text-transform: uppercase;
`;

const FooterLink = styled(Link)`
  width: fit-content;
  color: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ExternalLink = styled.a`
  width: fit-content;
  color: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const SocialRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const SocialLink = styled.a`
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.white};
  font-size: 11px;
  letter-spacing: 0.08em;
  transition: border-color 0.25s ease, color 0.25s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gold};
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const Bar = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: clamp(48px, 7vw, 72px);
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 240, 0.55);
  font-size: 12px;
  letter-spacing: 0.08em;
`;

const LangToggle = styled.button<{ $active?: boolean }>`
  position: relative;
  z-index: 2;
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.gold : 'rgba(245, 245, 240, 0.72)')};
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  pointer-events: auto;
  transition: color 0.25s ease;
`;

const LangRow = styled.div`
  display: flex;
  gap: 12px;
`;

const FOOTER_NAV: { key: NavKey; to: string }[] = [
  { key: 'projects', to: '/#projects' },
  { key: 'sold', to: '/#sold' },
  { key: 'sellWithUs', to: '/#sell-with-us' },
  { key: 'about', to: '/#about' },
  { key: 'journal', to: '/blog' },
];

const PORTAL_URL = '/admin';

export function Footer() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <FooterWrap>
      <Watermark aria-hidden="true">
        <OurenLogo height={200} />
      </Watermark>
      <Grid>
        <Column>
          <Label>{t.footer.navigation}</Label>
          {FOOTER_NAV.map((item) => (
            <FooterLink className="hoverable" key={item.to} to={item.to}>
              {t.nav[item.key]}
            </FooterLink>
          ))}
          <ExternalLink className="hoverable" href={PORTAL_URL}>
            {t.footer.portal}
          </ExternalLink>
        </Column>
        <Column>
          <Label>{t.footer.contact}</Label>
          <ExternalLink className="hoverable" href="mailto:hello@ouren.cz">
            hello@ouren.cz
          </ExternalLink>
          <ExternalLink className="hoverable" href="tel:+420123456789">
            +420 123 456 789
          </ExternalLink>
          <SocialRow>
            <SocialLink aria-label="LinkedIn" className="hoverable" href="https://linkedin.com" rel="noreferrer" target="_blank">
              in
            </SocialLink>
            <SocialLink aria-label="Instagram" className="hoverable" href="https://instagram.com" rel="noreferrer" target="_blank">
              ig
            </SocialLink>
          </SocialRow>
        </Column>
      </Grid>
      <Bar>
        <span>{t.footer.copyright}</span>
        <LangRow>
          <LangToggle
            $active={locale === 'cs'}
            className="hoverable"
            onClick={() => setLocale('cs')}
            type="button"
          >
            {t.lang.switchToCzech}
          </LangToggle>
          <LangToggle
            $active={locale === 'en'}
            className="hoverable"
            onClick={() => setLocale('en')}
            type="button"
          >
            {t.lang.switchToEnglish}
          </LangToggle>
        </LangRow>
      </Bar>
    </FooterWrap>
  );
}
