import { ReactNode } from "react"

type HeroProps = {
  title: ReactNode;
  description?: ReactNode;
};

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-[#1E293B]">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

const Hero: React.FC<HeroProps> = ({ title, description }: HeroProps) => (
  <section className="bg-gradient-to-b from-slate-50 to-white py-20 px-6">
    <div className="max-w-4xl mx-auto text-center">
      {/* Badge */}
      <span className="inline-block text-xs font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-6">
        Trusted by 10,000+ teams
      </span>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#1E293B] mb-6">
        {title}
      </h1>

      {/* Description */}
      {description && (
        <div className="text-lg leading-relaxed text-gray-500 max-w-2xl mx-auto mb-10">
          {description}
        </div>
      )}

      {/* CTAs */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <a
          href="#"
          className="inline-flex items-center px-6 py-3 bg-[#1E293B] text-white text-sm font-semibold rounded-full hover:bg-[#334155] transition-colors"
        >
          Start free trial
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 px-6 py-3 border border-gray-300 text-[#1E293B] text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
        >
          Book a demo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-12 md:gap-16">
        <StatBlock value="99.9%" label="Uptime SLA" />
        <div className="w-px h-10 bg-gray-200" />
        <StatBlock value="50ms" label="Avg. response time" />
        <div className="w-px h-10 bg-gray-200" />
        <StatBlock value="150+" label="Integrations" />
      </div>
    </div>
  </section>
);

export default Hero;
