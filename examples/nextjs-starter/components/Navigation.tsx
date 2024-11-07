import React from "react";
import Link from "next/link";

export interface NavigationProps {
  navLinks: Array<NavLink>;
}

export interface NavLink {
  title: string;
  url: string;
}

const Navigation: React.FC<NavigationProps> = ({
  navLinks,
}: NavigationProps) => {
  if (!navLinks) {
    return null;
  }

  const links = [...navLinks.filter((l) => l.url !== "/")];
  links.unshift({ url: "/", title: "Home" });
  return (
    <div className="navigation">
      {links.map((e: NavLink, i: number) => (
        <span key={i}>
          <Link href={e.url}>{e.title}</Link>
        </span>
      ))}
      {links.length <= 1 ? (
        <span className="note">
          (add another node in project map to see new link here)
        </span>
      ) : null}
    </div>
  );
};

export default Navigation;
