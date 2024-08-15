import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { retrieveRoute } from "@uniformdev/canvas-next-rsc";
import { unstable_setRequestLocale } from "next-intl/server";
import Composition from "@/components/composition";
import {
  getPageMetaData,
  getStaticParams,
  isRouteWithoutErrors,
} from "@/lib/uniform/utils";

export async function generateMetadata(props: {
  params: { path: string[]; locale: string };
}): Promise<Metadata> {
  const { path, locale } = props.params;
  const routePath = path.length > 0 ? `${locale}/${path}` : locale;
  const params = { params: { path: routePath } };
  const route = await retrieveRoute(params);

  if (!isRouteWithoutErrors(route)) return notFound();
  return getPageMetaData(route);
}

export async function generateStaticParams() {
  return await getStaticParams();
}

type Props = {
  params: { locale: string; path: Array<string> };
};

export default function Home({ params: { locale, path } }: Props) {
  unstable_setRequestLocale(locale);
  return <Composition locale={locale} path={path.join("/")} />;
}

export const dynamic = "force-static";
