import * as React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = (props: any) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <div className="mb-auto">{props.children}</div>
      <Footer />
    </div>
  );
};
