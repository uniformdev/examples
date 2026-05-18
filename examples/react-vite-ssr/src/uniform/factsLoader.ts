import { useEffect } from "react";
import { useUniformContext } from "@uniformdev/context-react";
import { VISITOR_FACTS_QUIRK } from "./jsonRulesPlugin";

// v1 sample facts. FLAT object — top-level keys only, no nested structure.
// Keys MUST match the fact identifiers offered in the rule editor
// (mesh-integration/lib/jsonRulesSettings.ts → DEFAULT_FACTS) verbatim. A
// mismatch leaves a fact undefined at evaluation time, which makes every
// rule referencing it fail and the default variant render instead.
//
// When wiring real visitor data, replace the constant + effect body with a
// fetch — the rest of the plumbing stays unchanged.
const SAMPLE_VISITOR_FACTS: Record<string, unknown> = {
  appointment_date: "2026-06-05",
  appointment_status: "Waiting Confirmation",
  appointment_end_time: "2026-06-10",
  appointment_requested_date: "2026-05-12",
  appointment_interval: "weekly",
  order_status: "Active",
  product_instance_product_id: "Internet",
  user_segment_id: "3873823683",
  alert_set_status: "active",
  marketing_campaign_start_date: "2026-06-01",
  first_name: "Alex",
};

export function useLoadVisitorFacts() {
  const { context } = useUniformContext();
  useEffect(() => {
    context.update({
      quirks: { [VISITOR_FACTS_QUIRK]: JSON.stringify(SAMPLE_VISITOR_FACTS) },
    });
  }, [context]);
}
