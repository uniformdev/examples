import { ReactNode } from "react"

type Plan = {
  name: string
  badge: string
  features: string[]
  price: string
  period: string
}

const plans: Plan[] = [
  {
    name: "Starter",
    badge: "For individuals",
    features: [
      "5 projects",
      "10 GB storage",
      "Basic analytics",
      "Email support",
    ],
    price: "$19",
    period: "mo",
  },
  {
    name: "Pro",
    badge: "Most popular",
    features: [
      "Unlimited projects",
      "100 GB storage",
      "Advanced analytics",
      "Priority support",
    ],
    price: "$49",
    period: "mo",
  },
  {
    name: "Enterprise",
    badge: "For teams",
    features: [
      "Unlimited projects",
      "1 TB storage",
      "Custom analytics & reports",
      "Dedicated account manager",
    ],
    price: "$149",
    period: "mo",
  },
]

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,10 8,14 16,6" />
    </svg>
  )
}

function FeatureRow({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" }}>
      <div style={{ flexShrink: 0 }}><CheckIcon /></div>
      <div style={{ fontSize: "14px", color: "#444" }}>{children}</div>
    </div>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      style={{
        border: "1px solid #d4d8dc",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        minWidth: "280px",
        flex: "1 1 0",
      }}
    >
      {/* Features section */}
      <div style={{ padding: "28px 28px 20px" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "white",
            backgroundColor: "#1a1c2e",
            borderRadius: "4px",
            padding: "3px 10px",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          {plan.badge}
        </span>

        <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" }}>
          {plan.name}
        </h3>

        {plan.features.map((feature) => (
          <FeatureRow key={feature}>{feature}</FeatureRow>
        ))}
      </div>

      {/* Pricing section */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "24px 28px 28px",
          marginTop: "auto",
        }}
      >
        <div style={{ fontSize: "40px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}>
          {plan.price}
          <span style={{ fontSize: "18px", fontWeight: 400 }}>/{plan.period}</span>
        </div>
        <p style={{ fontSize: "12px", color: "#666", margin: "6px 0 20px" }}>
          Billed monthly. Cancel anytime.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            style={{
              padding: "12px 24px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#047857")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          >
            Get started
          </button>
          <a
            href="#"
            style={{
              fontSize: "14px",
              color: "#333",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            View details
          </a>
        </div>
      </div>
    </div>
  )
}

export function Plans({ title }: { title: ReactNode }) {
  return (
    <section
      style={{
        padding: "48px 24px",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <h2
        style={{
          fontSize: "32px",
          fontWeight: 300,
          color: "#1E293B",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: "14px", color: "#555", margin: "0 0 32px" }}>
        Flexible plans to power your workflow. Scale up or down as your needs change.
      </p>

      {/* Plan cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          color: "#666",
          marginTop: "32px",
        }}
      >
        All plans include a 14-day free trial. No credit card required.
      </p>
    </section>
  )
}
