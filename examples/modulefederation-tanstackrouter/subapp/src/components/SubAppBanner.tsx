import { ReactNode } from "react"

export interface SubAppBannerProps {
  title: ReactNode
}
function SubAppBanner({ title }: SubAppBannerProps) {
  return (
    <div
      style={{
        margin: '10px 0',
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 50%, #F59E0B 100%)",
        borderRadius: "12px",
        minHeight: "320px",
        display: "flex",
        alignItems: "stretch",
        color: "white",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          flex: "0 0 38%",
          minWidth: "280px",
        }}
      >
        {/* Partner badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1.1 }}>
              Nexawave
            </div>
            <div
              style={{
                fontSize: "10px",
                opacity: 0.8,
                letterSpacing: "0.02em",
                marginTop: "2px",
              }}
            >
              Next-gen connectivity
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginTop: "auto", paddingTop: "32px" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {title}
          </h2>

          {/* CTA */}
          <button
            style={{
              marginTop: "24px",
              padding: "12px 28px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "white",
              color: "#7C3AED",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)"
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Right side: decorative text + arch image */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Large "NW" text */}
        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: "clamp(120px, 15vw, 220px)",
            fontWeight: 700,
            lineHeight: 1,
            color: "white",
            letterSpacing: "-0.03em",
            marginRight: "5%",
            textShadow: "0 2px 40px rgba(0,0,0,0.15)",
            opacity: 0.15,
          }}
        >
          NW
        </span>
      </div>
    </div>
  )
}

export default SubAppBanner
