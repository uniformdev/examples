import type { AppProps } from "next/app";
import Link from "next/link";
import { UniformContext } from "@uniformdev/context-react";
import type { UniformAppProps } from "@uniformdev/context-next";
import { createUniformContext } from "@/lib/uniform/createUniformContext";
import { SearchNav } from "@/components/search-nav";

import "@/styles/globals.css";

const clientContext = createUniformContext();

function MyApp({
  Component,
  pageProps,
  serverUniformContext,
}: UniformAppProps<AppProps>) {
  return (
    <UniformContext
      context={serverUniformContext ?? clientContext}
      outputType="standard"
    >
      <nav>
        <SearchNav />
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/search">Search</Link>
          </li>
        </ul>
      </nav>
      <Component {...pageProps} />
    </UniformContext>
  );
}

export default MyApp;
