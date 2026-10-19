import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.figure`
  display: grid;
  gap: 14px;
  margin: 0 calc(${({ theme }) => theme.spacing.pageX} * -1);
`;

const Stage = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.brightSurface};
`;

const Image = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: min(72vh, 760px);
  object-fit: cover;
`;

const Arrow = styled.button<{ $side: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === 'prev' ? 'left: 16px;' : 'right: 16px;')}
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 0;
  background: rgba(5, 6, 15, 0.42);
  color: ${({ theme }) => theme.colors.white};
  transform: translateY(-50%);
  cursor: pointer;
  transition:
    transform 140ms cubic-bezier(0.23, 1, 0.32, 1),
    background 180ms cubic-bezier(0.23, 1, 0.32, 1);

  &:hover,
  &:focus-visible {
    background: rgba(5, 6, 15, 0.62);
    outline: none;
  }

  &:active {
    transform: translateY(-50%) scale(0.97);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Rail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 18px;
  padding-inline: ${({ theme }) => theme.spacing.pageX};
`;

const Count = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.brightInk};
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.18em;
`;

const Film = styled.div`
  display: flex;
  gap: 10px;
  padding-block: 4px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(5, 6, 15, 0.28) transparent;
`;

const Thumb = styled.button<{ $active: boolean }>`
  flex: 0 0 clamp(120px, 16vw, 188px);
  aspect-ratio: 3 / 2;
  padding: 0;
  border: 0;
  background: ${({ theme }) => theme.colors.brightSurface};
  opacity: ${({ $active }) => ($active ? 1 : 0.48)};
  outline: ${({ $active, theme }) => ($active ? `1px solid ${theme.colors.navy}` : 'none')};
  outline-offset: 3px;
  cursor: pointer;
  transition:
    opacity 180ms cubic-bezier(0.23, 1, 0.32, 1),
    transform 140ms cubic-bezier(0.23, 1, 0.32, 1);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.navy};
    outline-offset: 2px;
  }
`;

function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        d={direction === 'prev' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

type PropertyGalleryProps = {
  photos: string[];
  alt: string;
  prevLabel: string;
  nextLabel: string;
};

export function PropertyGallery({ photos, alt, prevLabel, nextLabel }: PropertyGalleryProps) {
  const frames = photos.filter((url, index, all) => Boolean(url) && all.indexOf(url) === index);
  const signature = frames.join('|');
  const [active, setActive] = useState(0);
  const index = Math.min(active, Math.max(frames.length - 1, 0));
  const many = frames.length > 1;

  useEffect(() => {
    setActive(0);
  }, [signature]);

  function step(delta: number) {
    setActive((current) => (current + delta + frames.length) % frames.length);
  }

  if (!frames.length) return null;

  return (
    <Wrap>
      <Stage>
        <Image alt={alt} decoding="async" src={frames[index]} />
        {many ? (
          <>
            <Arrow $side="prev" aria-label={prevLabel} type="button" onClick={() => step(-1)}>
              <ArrowIcon direction="prev" />
            </Arrow>
            <Arrow $side="next" aria-label={nextLabel} type="button" onClick={() => step(1)}>
              <ArrowIcon direction="next" />
            </Arrow>
          </>
        ) : null}
      </Stage>
      {many ? (
        <Rail>
          <Film>
            {frames.map((url, frame) => (
              <Thumb
                $active={frame === index}
                aria-label={`${frame + 1} / ${frames.length}`}
                className="hoverable"
                key={url}
                type="button"
                onClick={() => setActive(frame)}
              >
                <img alt="" src={url} />
              </Thumb>
            ))}
          </Film>
          <Count>
            {String(index + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
          </Count>
        </Rail>
      ) : null}
    </Wrap>
  );
}
