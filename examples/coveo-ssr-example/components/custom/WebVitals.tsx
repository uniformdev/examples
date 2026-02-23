"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useCallback, useState } from "react";

type MetricName = "FCP" | "LCP" | "CLS" | "FID" | "TTFB" | "INP";
type Metrics = Record<
  MetricName,
  { value: number; delta: number; rating: string } | null
>;

const getRatingColor = (rating: string) => {
  switch (rating) {
    case "good":
      return "text-green-500";
    case "needs-improvement":
      return "text-yellow-500";
    case "poor":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export default function WebVitals() {
  const [metrics, setMetrics] = useState<Metrics>({
    TTFB: null,
    FCP: null,
    LCP: null,
    FID: null,
    CLS: null,
    INP: null,
  });

  // Use useCallback to create a stable function reference
  const reportWebVitals = useCallback(
    (metric: {
      name: string;
      value: number;
      delta: number;
      rating: string;
    }) => {
      setMetrics((prevMetrics) => {
        const newMetrics = { ...prevMetrics };
        const name = metric.name as MetricName;

        if (name in newMetrics) {
          newMetrics[name] = {
            value: metric.value,
            delta: metric.delta,
            rating: metric.rating,
          };
        }

        console.log(metric);
        return newMetrics;
      });
    },
    []
  );

  useReportWebVitals(reportWebVitals);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow">
      {Object.entries(metrics).map(([key, metric]) => (
        <div
          key={key}
          className="flex flex-col items-center p-3 border rounded-lg min-w-[120px]"
        >
          <div className="text-sm font-semibold text-gray-600">{key}</div>
          <div
            className={`text-lg font-bold ${
              metric ? getRatingColor(metric.rating) : "text-gray-400"
            }`}
          >
            {key === "CLS"
              ? metric
                ? metric.value.toFixed(3)
                : "N/A"
              : metric
              ? `${Math.round(metric.value)}ms`
              : "N/A"}
          </div>
          <div
            className={`text-xs ${
              metric ? getRatingColor(metric.rating) : "text-gray-400"
            }`}
          >
            {metric?.rating || "pending"}
          </div>
        </div>
      ))}
    </div>
  );
}
