export const QUANTITIES = [20, 50, 100, 500] as const;
export const TIMER_SECONDS = 180;

export function getCampaignUrl() {
  return process.env.CAMPAIGN_URL || "https://example.com";
}
