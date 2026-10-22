import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../i18n/LanguageContext';
import type { NavKey } from '../../i18n/types';

const FooterWrap = styled.footer`
  padding: clamp(48px, 6vw, 72px) ${({ theme }) => theme.spacing.pageX} 28px;
  background: ${({ theme }) => theme.colors.deepBlack};
`;

const Grid = styled.div`
  display: grid;
  gap: 40px;

  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Column = styled.div`
  display: grid;
  gap: 14px;
  align-content: start;
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
    border-color: ${({ theme }) => theme.colors.ice};
    color: ${({ theme }) => theme.colors.ice};
  }
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 240, 0.55);
  font-size: 12px;
  letter-spacing: 0.08em;
`;

const LangRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LangDivider = styled.span`
  color: rgba(245, 245, 240, 0.22);
  font-size: 10px;
`;

const Legal = styled.p`
  margin: 28px 0 0;
  max-width: 62rem;
  color: rgba(245, 245, 240, 0.45);
  font-size: 12px;
  line-height: 1.55;
`;

const LegalLink = styled.a`
  color: rgba(245, 245, 240, 0.72);
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.colors.ice};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.ice};
    outline-offset: 3px;
  }
`;

const LangToggle = styled.button<{ $active?: boolean }>`
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.ice : 'rgba(245, 245, 240, 0.4)'};
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 200ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.ice};
    outline: none;
  }
`;

const FOOTER_NAV: { key: NavKey; to: string }[] = [
  { key: 'sale', to: '/prodej' },
  { key: 'rent', to: '/pronajem' },
  { key: 'weBuy', to: '/kupujeme' },
  { key: 'projects', to: '/projekty' },
  { key: 'sold', to: '/#sold' },
  { key: 'about', to: '/o-nas' },
  { key: 'journal', to: '/blog' },
  { key: 'contact', to: '/#contact' },
];

const PORTAL_URL = '/admin';

export function Footer() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <FooterWrap>
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
          <ExternalLink className="hoverable" href="mailto:info@ouren.cz">
            info@ouren.cz
          </ExternalLink>
          <ExternalLink className="hoverable" href="tel:+420722033055">
            +420 722 033 055
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
            aria-pressed={locale === 'cs'}
            className="hoverable"
            onClick={() => setLocale('cs')}
            type="button"
          >
            CZ
          </LangToggle>
          <LangDivider aria-hidden>/</LangDivider>
          <LangToggle
            $active={locale === 'en'}
            aria-pressed={locale === 'en'}
            className="hoverable"
            onClick={() => setLocale('en')}
            type="button"
          >
            EN
          </LangToggle>
        </LangRow>
      </Bar>
      <Legal>
        {t.footer.operator}{' '}
        <LegalLink
          href="https://rejstrik-firem.kurzy.cz/21369178/sd-group-prosperity-sro/"
          rel="noreferrer"
          target="_blank"
        >
          {t.about.operatorLink}
        </LegalLink>
      </Legal>
    </FooterWrap>
  );
}
