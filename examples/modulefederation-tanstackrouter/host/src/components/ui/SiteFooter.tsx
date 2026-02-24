function FooterLink({ children }: { children: string }) {
  return (
    <li>
      <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
        {children}
      </a>
    </li>
  )
}

function TouchLink({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <li>
      <a href="#" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
        {icon}
        {children}
      </a>
    </li>
  )
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0F172A] text-white mt-auto pt-4">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company */}
          <div>
            <h4 className="font-semibold text-base mb-4">Company</h4>
            <ul className="space-y-2.5">
              <FooterLink>About</FooterLink>
              <FooterLink>Blog</FooterLink>
              <FooterLink>Careers</FooterLink>
              <FooterLink>Press</FooterLink>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-base mb-4">Product</h4>
            <ul className="space-y-2.5">
              <FooterLink>Pricing</FooterLink>
              <FooterLink>Changelog</FooterLink>
              <FooterLink>Documentation</FooterLink>
              <FooterLink>Status</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-base mb-4">Support</h4>
            <ul className="space-y-4">
              <TouchLink icon={<ChatIcon />}>Help center</TouchLink>
              <TouchLink icon={<PhoneIcon />}>Contact sales</TouchLink>
              <TouchLink icon={<CalendarIcon />}>Book a demo</TouchLink>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
