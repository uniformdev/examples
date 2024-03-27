import { getRequestConfig } from "next-intl/server";

/** Configure i18n static translation messages */
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../localized-microcopy/${locale}.json`)).default,
}));
