import React from "react";
import dynamic from "next/dynamic";
import Logo from "./Logo";

const DevTools = dynamic(() => import("./DevTools"), { ssr: false });

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <span>Powered by</span>
        <a href="https://uniform.dev" target="_blank" rel="noopener noreferrer">
          <Logo width={220} />
        </a>
      </footer>
      <DevTools />
    </>
  );
}
