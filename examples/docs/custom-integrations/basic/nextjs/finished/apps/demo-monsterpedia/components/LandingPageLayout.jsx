import Head from "next/head";
import { Slot } from "@uniformdev/canvas-react";

export default function LandingPageLayout({ composition }) {
  const name = composition?.parameters?.pageName?.value;
  return (
    <div className="container">
      <Head>
        <title>Uniform Demo: {name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-2 px-4">
          <div className="text-center">
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              {name}
            </p>
          </div>
        </div>
      </div>
      <Slot name="body" />
    </div>
  );
}
