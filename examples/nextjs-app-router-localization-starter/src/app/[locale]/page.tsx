import Composition from "@/components/composition";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  return <Composition locale={locale} path="/" />;
}

export const dynamic = "force-static";
