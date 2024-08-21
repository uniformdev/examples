import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { retrieveRoute } from "@uniformdev/canvas-next-rsc";
import Composition from "@/components/composition";
import { getPageMetaData, isRouteWithoutErrors } from "@/lib/uniform/utils";

type Props = {
  params: { locale: string };
};

export async function generateMetadata(props: {
  params: { path: string[]; locale: string };
}): Promise<Metadata> {
  const { locale } = props.params;
  const params = { params: { path: locale } };
  const route = await retrieveRoute(params);

  if (!isRouteWithoutErrors(route)) return notFound();
  return getPageMetaData(route);
}

export default function IndexPage({ params: { locale } }: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  return <Composition locale={locale} path={["/"]} />;
}

export const dynamic = "force-static";
