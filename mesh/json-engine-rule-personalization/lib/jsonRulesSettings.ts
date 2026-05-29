export type IntegrationSettings = {
  facts?: string[];
};

// Default fact list — extracted from the customer's sample json-rules-engine
// rules. Editors can edit this list on the integration settings page.
export const DEFAULT_FACTS: string[] = [
  'appointment_date',
  'appointment_status',
  'appointment_end_time',
  'appointment_requested_date',
  'appointment_interval',
  'order_status',
  'product_instance_product_id',
  'user_segment_id',
  'alert_set_status',
  'marketing_campaign_start_date',
  'first_name',
];

export function getConfiguredFacts(settings: IntegrationSettings | undefined): string[] {
  const facts = settings?.facts;
  if (Array.isArray(facts) && facts.length > 0) return facts;
  return DEFAULT_FACTS;
}
