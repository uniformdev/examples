import { CookieAdapter, Context } from '@uniformdev/context';
import type { NextPageContext } from 'next';
import type { AppProps } from 'next/app';
import { CookieSerializeOptions } from 'next/dist/server/web/types';
// eslint-disable-next-line @next/next/no-document-import-in-page
import type { DocumentContext } from 'next/document';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { parse } from 'cookie';

/** Teaches Uniform how to get and set cookies in Next.js using `nookies` */
export class NextCookieAdapter implements CookieAdapter {
  constructor(
    private serverContext?: NextPageContext,
    private cookieOptions: CookieSerializeOptions = { sameSite: 'strict', secure: true }
  ) {}

  get(key: string) {
    // get cookies from the request
    let cookies = parseCookies(this.serverContext);

    // if cookies have been added to the response we need those here too
    // - in addition to any request cookies
    if (this.serverContext?.res?.getHeaders) {
      const resHeaders = this.serverContext.res.getHeaders();
      const resCookies = resHeaders['set-cookie'];
      if (resCookies) {
        cookies = { ...cookies, ...parse((resCookies as string[])[0]) };
      }
    }

    return cookies[key];
  }

  set(key: string, value: string) {
    setCookie(this.serverContext, key, value, this.cookieOptions);
  }

  remove(key: string) {
    destroyCookie(this.serverContext, key);
  }
}

/**
 * Enables request-data tracking during server-side rendering passes,
 * and sending that data back up to the client.
 *
 * This function must be called in a custom Next _document's `getInitialProps`
 * function to work properly.
 */
export function enableNextSsr(ctx: DocumentContext, context: Context) {
  // we monkeypatch renderPage here so that we can pass the server-side tracker
  // to the App component as a prop, _without it being serialized in page state_,
  // like it would be if we did this in App's getInitialProps. The SSR tracker is an
  // ephemeral class and should not be serialized.
  const originalRenderPage = ctx.renderPage;

  const { req } = ctx;

  // we track the 'page view' on the server side. This will be ignored after initial score change
  // on the client side, which will do the same tracking as here thus not double counting.
  context.update({
    // note: https and unknown here are ok, because nothing is matching on host or protocol in the tracker
    url: new URL(`https://${req!.headers.host ?? 'unknown'}${req!.url}`),
    cookies: req!.headers.cookie ? parse(req!.headers.cookie) : undefined,
  });

  ctx.renderPage = (opts) =>
    originalRenderPage({
      ...opts,
      enhanceApp: (App) => {
        const UniformSSREnhancer = (props: any) => {
          return <App {...props} serverUniformTracker={context} />;
        };

        return UniformSSREnhancer;
      },
    });
}

/** Type of <App> props if enableNextSsr() is setup in _document. */
export type UniformAppProps<P = {}> = AppProps<P> & { serverUniformContext?: Context };
