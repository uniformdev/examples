import type { Translation } from '@klevu/ui/dist/types/components'

import en from './en.json'

const fallbackTranslations : Record<string, Translation> = {
    en,
};

export const getFallbackTranslation = (lang: string | null | undefined): typeof en => {
    return lang ? (fallbackTranslations[lang] ?? en): en;
}