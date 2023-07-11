import React from "react";
import Script from "next/script";

const App = ({ Component, pageProps }) => {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
};

export default App;
