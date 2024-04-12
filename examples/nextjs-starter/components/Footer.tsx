import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <span>Powered by</span>
      <a href="https://uniform.dev" target="_blank" rel="noopener noreferrer">
        <Logo width={220} />
      </a>
    </footer>
  );
}
