// Use type safe message keys with `next-intl`
type Messages = typeof import('./localized-microcopy/en.json');
declare interface IntlMessages extends Messages {}
