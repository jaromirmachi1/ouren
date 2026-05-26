import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import { scrollTriggerDefaults } from '../../styles/animations';

gsap.registerPlugin(ScrollTrigger);

type SplitTextProps = {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  children: string;
  className?: string;
  triggerOnScroll?: boolean;
  splitBy?: 'lines' | 'words';
};

const Text = styled.span`
  display: block;
`;

export function SplitText({
  as: Tag = 'h2',
  children,
  className,
  triggerOnScroll = true,
  splitBy = 'lines',
}: SplitTextProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const units =
      splitBy === 'lines'
        ? children.split('\n').filter(Boolean)
        : children.split(' ').filter(Boolean);

    root.innerHTML = units
      .map((unit) => {
        const content = splitBy === 'lines' ? unit : `${unit}&nbsp;`;
        return `<span class="split-line" style="display:block;overflow:hidden"><span class="split-inner" style="display:inline-block">${content}</span></span>`;
      })
      .join('');

    const inners = root.querySelectorAll('.split-inner');

    gsap.set(inners, { yPercent: 110, autoAlpha: 0 });

    const tween = gsap.to(inners, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
      ...(triggerOnScroll
        ? {
            scrollTrigger: {
              trigger: root,
              ...scrollTriggerDefaults,
            },
          }
        : {}),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [children, splitBy, triggerOnScroll]);

  return <Text as={Tag} className={className} ref={rootRef} />;
}
