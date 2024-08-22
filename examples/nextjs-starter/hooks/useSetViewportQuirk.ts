/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useUniformContext } from '@uniformdev/context-react';

/**
 * Example hook demonstrating how to live-set a quirk value based on viewport width
 * Which can then be fed into visibility control to show or hide components based on viewport
 */

const BREAKPOINTS = {
  mobile: 512,
  tablet: 768,
};

export function useSetViewportQuirk() {
  const { context } = useUniformContext({ throwOnMissingProvider: false });
  useEffect(() => {
    const debounce = (func: any, delay: any) => {
      let debounceTimer: any;
      return function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          func();
        }, delay);
      };
    };

    const debouncedHandler = debounce(() => {
      const viewport = window.innerWidth < BREAKPOINTS.mobile ? 'm' : window.innerWidth < BREAKPOINTS.tablet ? 't' : 'd';
      context?.update({
        quirks: {
          viewport,
        },
      });
    }, 50);

    debouncedHandler();
    window.addEventListener('resize', debouncedHandler);
    return () => {
      window.removeEventListener('resize', debouncedHandler);
    };
  }, [context]);
}
