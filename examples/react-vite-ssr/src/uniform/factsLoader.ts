import { useEffect } from "react";
import { useUniformContext } from "@uniformdev/context-react";
import { VISITOR_FACTS_QUIRK } from "./jsonRulesPlugin";

// v1 sample facts. FLAT object — top-level keys only, no nested structure.
// Authors reference these keys verbatim as `fact` in the rule editor.
//
// When wiring real visitor data, replace the constant + effect body with a
// fetch — the rest of the plumbing stays unchanged.
const SAMPLE_VISITOR_FACTS: Record<string, unknown> = {
  order_appointment_date: "2026-06-05",
  order_appointment_status: "Waiting Confirmation",
  order_appointment_end_time: "2026-06-10",
  order_status: "Active",
  product_instance_product_id: "Internet",
  user_segment_id: "3873823683",
  first_name: "Alex",
  alert_set_status: "active",
  marketing_campaign_start_date: "2026-06-01",
};

export function useLoadVisitorFacts() {
  const { context } = useUniformContext();
  useEffect(() => {
    context.update({
      quirks: { [VISITOR_FACTS_QUIRK]: JSON.stringify(SAMPLE_VISITOR_FACTS) },
    });
  }, [context]);
}
