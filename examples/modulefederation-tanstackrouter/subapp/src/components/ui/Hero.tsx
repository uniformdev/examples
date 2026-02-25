import { ReactNode } from "react"

type HeroProps = {
  title: ReactNode;
  description?: ReactNode;
  ctas?: ReactNode;
};

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-[#1E293B]">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

const Hero: React.FC<HeroProps> = ({ title, description, ctas }: HeroProps) => (
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
      {ctas && (
        <div className="flex items-center justify-center gap-4 mb-16">
          {ctas}
        </div>
      )}

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
