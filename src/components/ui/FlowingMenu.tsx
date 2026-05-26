/**
 * Flowing Menu — adapted from React Bits (https://reactbits.dev/components/flowing-menu)
 */
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import gsap from 'gsap';
import styled, { css, keyframes } from 'styled-components';
import { getPerformanceTier } from '../../utils/performance';

const marqueeScroll = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(var(--marquee-shift, -50%), 0, 0);
  }
`;

export type FlowingMenuItem = {
  link: string;
  text: string;
  image: string;
};

type FlowingMenuProps = {
  items?: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  onItemClick?: (item: FlowingMenuItem) => void;
};

const MenuWrap = styled.div<{ $bg: string }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${({ $bg }) => $bg};
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
`;

const MenuLabel = styled.span`
  display: block;
  transition:
    opacity 0.4s ease,
    visibility 0.4s ease;
`;

const MenuItemWrap = styled.div<{ $border: string }>`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: clamp(180px, 22vh, 260px);
  overflow: hidden;
  border-top: 1px solid ${({ $border }) => $border};

  &:first-child {
    border-top: none;
  }

  &:hover ${MenuLabel} {
    opacity: 0;
    visibility: hidden;
  }
`;

const MenuItemLink = styled.a<{ $color: string }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  color: ${({ $color }) => $color};
  font-size: clamp(32px, 5.5vh, 72px);
  font-weight: ${({ theme }) => theme.typography.weights.light};
  letter-spacing: ${({ theme }) => theme.typography.tracking.tight};
  line-height: 1;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: crosshair;

  &:hover,
  &:focus-visible {
    color: ${({ $color }) => $color};
  }
`;

const Marquee = styled.div<{ $bg: string; $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  overflow: hidden;
  width: 100%;
  height: 100%;
  color: ${({ $color }) => $color};
  background-color: ${({ $bg }) => $bg};
  pointer-events: none;
  transform: translate3d(0, 101%, 0);
`;

const MarqueeInnerWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const MarqueeInner = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const MarqueeTrack = styled.div<{ $active: boolean; $duration: number }>`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 100%;
  will-change: ${({ $active }) => ($active ? 'transform' : 'auto')};

  ${({ $active, $duration }) =>
    $active
      ? css`
          animation: ${marqueeScroll} ${$duration}s linear infinite;
        `
      : css`
          animation: none;
        `}
`;

const MarqueePart = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
`;

const MarqueeText = styled.span`
  padding: 0 1vw;
  font-size: clamp(32px, 5.5vh, 72px);
  font-weight: ${({ theme }) => theme.typography.weights.regular};
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
`;

const MarqueeImage = styled.div<{ $image: string }>`
  width: clamp(140px, 18vw, 240px);
  height: clamp(64px, 9vh, 96px);
  margin: 1.5em 2vw;
  padding: 1em 0;
  border-radius: 50px;
  background-image: url(${({ $image }) => $image});
  background-position: 50% 50%;
  background-size: cover;
`;

type MenuItemProps = FlowingMenuItem & {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  onItemClick?: (item: FlowingMenuItem) => void;
};

function MenuItem({
  link,
  text,
  image,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  onItemClick,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const isLowTier = getPerformanceTier() === 'low';

  const animationDefaults = { duration: 0.6, ease: 'expo.out' } as const;

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) {
        return;
      }

      const marqueeContent = marqueeInnerRef.current.querySelector('[data-marquee-part]') as HTMLElement | null;

      if (!marqueeContent) {
        return;
      }

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      const capped = isLowTier ? Math.min(needed, 5) : needed;
      setRepetitions(Math.max(4, capped));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);

    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [isLowTier, text, image]);

  useEffect(() => {
    if (!isHovered || !marqueeTrackRef.current) {
      return;
    }

    const marqueeContent = marqueeTrackRef.current.querySelector('[data-marquee-part]') as HTMLElement | null;

    if (!marqueeContent) {
      return;
    }

    const contentWidth = marqueeContent.getBoundingClientRect().width;

    if (contentWidth === 0) {
      return;
    }

    marqueeTrackRef.current.style.setProperty('--marquee-shift', `-${contentWidth}px`);
  }, [isHovered, repetitions, text, image]);

  const handleMouseEnter = (event: MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) {
      return;
    }

    const rect = itemRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    setIsHovered(true);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (event: MouseEvent) => {
    setIsHovered(false);
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) {
      return;
    }

    const rect = itemRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onItemClick) {
      event.preventDefault();
      onItemClick({ link, text, image });
    }
  };

  return (
    <MenuItemWrap $border={borderColor} ref={itemRef}>
      <MenuItemLink
        $color={textColor}
        className="hoverable"
        href={link}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <MenuLabel>{text}</MenuLabel>
      </MenuItemLink>
      <Marquee $bg={marqueeBgColor} $color={marqueeTextColor} ref={marqueeRef}>
        <MarqueeInnerWrap>
          <MarqueeInner ref={marqueeInnerRef}>
            <MarqueeTrack $active={isHovered} $duration={speed} ref={marqueeTrackRef}>
              {[...Array(repetitions)].map((_, index) => (
                <MarqueePart data-marquee-part={index === 0 ? true : undefined} key={index}>
                  <MarqueeText>{text}</MarqueeText>
                  <MarqueeImage $image={image} />
                </MarqueePart>
              ))}
            </MarqueeTrack>
          </MarqueeInner>
        </MarqueeInnerWrap>
      </Marquee>
    </MenuItemWrap>
  );
}

export function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#F5F5F0',
  bgColor = '#05060F',
  marqueeBgColor = '#C8A96E',
  marqueeTextColor = '#05060F',
  borderColor = 'rgba(255, 255, 255, 0.12)',
  onItemClick,
}: FlowingMenuProps) {
  return (
    <MenuWrap $bg={bgColor}>
      <Menu aria-label="Property categories">
        {items.map((item) => (
          <MenuItem
            key={item.text}
            {...item}
            borderColor={borderColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            onItemClick={onItemClick}
            speed={speed}
            textColor={textColor}
          />
        ))}
      </Menu>
    </MenuWrap>
  );
}
