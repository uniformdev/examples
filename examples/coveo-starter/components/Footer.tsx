import { FC } from "react";
import Logo from "./Logo";

const Footer: FC = () => (
  <footer className="footer">
    <span>Powered by</span>
    <a href="https://uniform.dev" target="_blank" rel="noopener noreferrer">
      <Logo width={220} />
    </a>
  </footer>
);

export default Footer;
