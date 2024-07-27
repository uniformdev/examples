import { useUniformContext } from '@uniformdev/context-react';
import { useEffect } from 'react';

/**
 * Example hook demonstrating how to live-set a quirk value based on viewport width
 * Which can then be fed into visibility control to show or hide components based on viewport
 */

const BREAKPOINTS = {
    mobile: 512,
    tablet: 768,
};

export function useSetViewportQuirk() {
    const context = useUniformContext({ throwOnMissingProvider: false });
    console.log('context', context);
    useEffect(() => {
        const debounce = (func, delay) => {
            let debounceTimer;
            return function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    func();
                }, delay);
            };
        };

        const debouncedHandler = debounce(() => {
            const deviceType = window.innerWidth < BREAKPOINTS.mobile
                ? 'm'
                : window.innerWidth < BREAKPOINTS.tablet
                    ? 't'
                    : 'd'
            console.log('setting quirks:', { deviceType });
            context?.context.update({
                quirks: {
                    deviceType
                },
            });
        }, 50);

        debouncedHandler();
        window.addEventListener('resize', debouncedHandler);
        return () => {
            window.removeEventListener('resize', debouncedHandler);
        };
    }, [context?.context]);
}