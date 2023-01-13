import React from "react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <a href="https://uniform.dev" target="_blank" rel="noopener noreferrer">
        <Logo width={220} />
      </a>
      <div style={{ paddingLeft: "25px" }}>
        Get our browser extension{" "}
        <a
          href="https://chrome.google.com/webstore/detail/uniform-context/dcmlokofjljnfjcknpmhjocogllfbhkg"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{" "}
        to inspect visitor context.
      </div>
    </footer>
  );
}
