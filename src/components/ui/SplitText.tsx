import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { refreshScrollTriggers, revealOnScroll } from '../../utils/scrollReveal';
import { prefersReducedMotion } from '../../utils/performance';

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
        return `<span class="split-line" style="display:block;overflow:hidden"><span class="split-inner" style="display:inline-block;opacity:1;visibility:visible">${content}</span></span>`;
      })
      .join('');

    if (prefersReducedMotion() || !triggerOnScroll) {
      return;
    }

    const inners = root.querySelectorAll('.split-inner');
    const context = revealOnScroll(root, inners, { y: 40, stagger: 0.08, duration: 1 });

    refreshScrollTriggers();

    return () => {
      context.revert();
    };
  }, [children, splitBy, triggerOnScroll]);

  return <Text as={Tag} className={className} ref={rootRef} />;
}
