import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import Composition from "@/components/composition";
import {
  getPageMetaData,
  getStaticParams,
  isRouteWithoutErrors,
  getRouteData,
} from "@/lib/uniform/utils";

export type RouteParams = { path: string[]; locale: string };

export async function generateMetadata(props: {
  params: RouteParams;
}): Promise<Metadata> {
  const route = await getRouteData(props.params);
  if (!isRouteWithoutErrors(route)) return notFound();
  return getPageMetaData(route);
}

export async function generateStaticParams() {
  return await getStaticParams();
}

export default function Home({ params }: { params: RouteParams }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  return <Composition {...params} />;
}

export const dynamic = "force-static";
