'use client';

import { useEffect } from 'react';
import { useUniformContext } from '@uniformdev/canvas-next-rsc/component';

export default function ScrollTracker() {
  const { context } = useUniformContext();

  useEffect(() => {
    const handleScrollMilestone = async (percentage: number) => {
      if (percentage && context && context.quirks?.scrollPosition !== `100p`) {
        context.update({
          quirks: {
            scrollPosition: `${percentage}p`,
          },
        });
      }
      document.dispatchEvent(
        new CustomEvent('scroll_milestone', {
          detail: {
            percentage,
            milestone: `${percentage}%`,
          },
        })
      );
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercentage === milestone) {
          handleScrollMilestone(milestone);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [context]); // Remove context from dependencies to prevent re-runs

  return null;
}
