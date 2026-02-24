import { Link } from "@tanstack/react-router"

function SiteLogo() {
  return (
    <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2" />
      <path d="M10 20 L16 10 L22 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="17" x2="20" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <text x="36" y="22" fill="white" fontFamily="system-ui, sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.5">Nexawave</text>
    </svg>
  )
}

const navLinkClass =
  "px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"

const activeNavLinkClass =
  "px-4 py-2 text-sm font-medium text-white bg-white/15 rounded"

export function SiteHeader() {
  return (
    <header className="bg-[#1E293B] text-white shadow-md">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/$" href="/" className="flex items-center gap-2 shrink-0">
            <SiteLogo />
          </Link>

          {/* Primary navigation */}
          <nav className="flex items-center gap-1 ml-8">
            <Link
              to="/$"
              href="/"
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to={"/products" as string}
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
              activeOptions={{ exact: true }}
            >
              Products
            </Link>
            <Link
              to="/subapp"
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
              activeOptions={{ exact: true }}
            >
              Sub App
            </Link>
            <Link
              to={"/subapp/pro" as string}
              className={navLinkClass}
              activeProps={{ className: activeNavLinkClass }}
            >
              Pro
            </Link>
          </nav>

        </div>
      </div>
    </header>
  )
}
