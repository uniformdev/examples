import classNames, { ArgumentArray } from 'classnames';
import { twMerge } from 'tailwind-merge';
import { Asset } from '@uniformdev/assets';
import {
    flattenValues,
} from '@uniformdev/canvas';
import { ViewPort } from './types';
import { HTMLAttributes } from 'react';

const TEMPLATE_REGEX = /\{[^}]+\}/g;

type ResolvedAsset = {
    id?: string;
    url: string;
    file?: string;
    size?: number;
    title?: string;
    width?: number;
    height?: number;
    mediaType?: string;
    description?: string;
};

export const resolveAsset = (image?: Asset[]): ResolvedAsset[] =>
    (flattenValues(image as never) || []).filter(({ url }) => Boolean(url));

export const resolveViewPort = (
    viewPort: string | ViewPort<string> | undefined,
    template?: string | undefined
): string => {
    if (!viewPort) return '';

    if (typeof viewPort === 'string') return template ? template.replaceAll(TEMPLATE_REGEX, viewPort) : viewPort;

    const { desktop, tablet, mobile } = viewPort;

    const styles = [
        desktop ? `lg:${template ? template.replace(TEMPLATE_REGEX, desktop) : desktop}` : '',
        tablet ? `md:${template ? template.replace(TEMPLATE_REGEX, tablet) : tablet}` : '',
        mobile ? `${template ? template.replace(TEMPLATE_REGEX, mobile) : mobile}` : '',
    ];

    return styles.filter(Boolean).join(' ');
};


export const cn = (...inputs: ArgumentArray) => twMerge(classNames(inputs));

const STATIC_UNITS = ['px', 'rem', 'em', 'vh', 'vw', '%', 'auto'];
const UNIT_REGEX = /\d+(\/\d+)?(\.\d+)?/g;

export const formatSpaceParameterValue = (
    spacing?: SpaceType | ViewPort<SpaceType>
): [SpaceType, Record<keyof SpaceType, string | ViewPort<string>>] => {
    // Spacing parameter undefined
    if (!spacing) return [{}, {} as Record<keyof SpaceType, string>];

    // Spacing parameter with view port functionality
    if ('desktop' in spacing || 'tablet' in spacing || 'mobile' in spacing) {
        return [
            {},
            (Object.keys(spacing) as (keyof ViewPort<SpaceType>)[]).reduce(
                (acc, device) => {
                    (Object.keys(spacing[device] || {}) as (keyof SpaceType)[]).forEach(property => {
                        const currentValue = spacing?.[device]?.[property];
                        if (typeof currentValue !== 'undefined') {
                            acc[property] = { ...acc[property], [device]: String(currentValue) };
                        }
                    });
                    return acc;
                },
                {} as Record<keyof SpaceType, ViewPort<string>>
            ),
        ];
    }

    // Simple spacing parameter
    return Object.entries(spacing as SpaceType).reduce(
        (acc, [key, value]) => {
            const isStaticUnit =
                typeof value === 'number' || STATIC_UNITS.includes(value.replace(UNIT_REGEX, '')) || value === 'auto';

            return isStaticUnit ? [{ ...acc[0], [key]: value }, acc[1]] : [acc[0], { ...acc[1], [key]: value }];
        },
        [{}, {} as Record<keyof SpaceType, string>]
    );
};

export type SpaceType = Pick<
    NonNullable<HTMLAttributes<HTMLDivElement>['style']>,
    | 'marginTop'
    | 'marginLeft'
    | 'paddingTop'
    | 'marginRight'
    | 'paddingLeft'
    | 'marginBottom'
    | 'paddingRight'
    | 'paddingBottom'
>;
