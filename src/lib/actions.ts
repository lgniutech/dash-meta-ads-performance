"use server";

import { MetaAdsAPI } from "./meta";

let TOKEN = process.env.META_ACCESS_TOKEN || "";

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
  let params: any = timeRange ? { time_range: timeRange } : { date_preset: datePreset };

  // Force manual range for this_month to ensure it's Day 1 to Today
  if (datePreset === "this_month" && !timeRange) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const since = firstDay.toISOString().split('T')[0];
    const until = now.toISOString().split('T')[0];
    params = { time_range: { since, until } };
  }
  
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
