import styled from 'styled-components';

type OurenLogoProps = {
  height?: number;
  className?: string;
};

const LogoImage = styled.img<{ $height: number }>`
  display: block;
  width: auto;
  height: ${({ $height }) => $height}px;
`;

const logoSrc = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}ouren-logo.png`;

export function OurenLogo({ height = 36, className }: OurenLogoProps) {
  return (
    <LogoImage
      $height={height}
      alt="Ouren"
      className={className}
      decoding="async"
      src={logoSrc}
    />
  );
}
