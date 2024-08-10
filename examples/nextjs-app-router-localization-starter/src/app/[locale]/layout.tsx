import React from "react";
import { UniformContext } from "@uniformdev/canvas-next-rsc";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import Header from "@/components/header";

import "../globals.css";

const locales = ["en", "de"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Header />
        <main>
          <NextIntlClientProvider messages={messages}>
            <UniformContext>{children}</UniformContext>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
