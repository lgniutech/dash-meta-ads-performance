"use server";

import { MetaAdsAPI } from "./meta";

let TOKEN = process.env.META_ACCESS_TOKEN || "EAAONvIhv3IABRXa3XI5h37NDcKzHeHGPnncEZBsC5WuZCliISzK8bQH2FpZBug68eKs78rVVcrwom5XbmImYgaGHTXnuv8pcInSXuKGnZB2y9ZAzrlJ4wDY5vZCN5VgzchkmenuZCY0E3XLBktzhCY1Q2RJSazcDn9sz1Uy3cdrmgqkVcfpZBafPTSdu4b4vzY32";

// Clean JSON token if needed
if (TOKEN.trim().startsWith("{")) {
  try {
    const parsed = JSON.parse(TOKEN);
    TOKEN = parsed.access_token || TOKEN;
  } catch (e) {
    console.error("Error parsing JSON token:", e);
  }
}

export async function getAccounts() {
  if (!TOKEN) {
    console.error("META_ACCESS_TOKEN is missing!");
    return [];
  }
  const api = new MetaAdsAPI(TOKEN, "");
  return await api.getAdAccounts();
}

export async function getDashboardData(
  accountId: string, 
  datePreset: string = "last_30d",
  timeRange?: { since: string; until: string }
) {
  if (!TOKEN || !accountId) return null;
  
  const api = new MetaAdsAPI(TOKEN, accountId);
  const params: any = timeRange ? { time_range: timeRange } : { date_preset: datePreset };
  
  // Fetch everything in parallel
  const [summary, campaigns, daily, audience, ads] = await Promise.all([
    api.getInsights(params),
    api.getCampaignInsights(params),
    api.getDailyInsights(params),
    api.getAudienceBreakdown(params),
    api.getBestCreative()
  ]);

  return {
    summary,
    campaigns,
    daily,
    audience,
    ads
  };
}
