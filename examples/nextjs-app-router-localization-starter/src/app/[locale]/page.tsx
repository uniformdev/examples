import Composition from "@/components/composition";
import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return <Composition locale={locale} path="/" />;
}

export const dynamic = "force-static";
