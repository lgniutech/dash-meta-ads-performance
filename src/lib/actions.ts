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

export async function getDashboardData(accountId: string, datePreset: string = "last_30d") {
  if (!TOKEN || !accountId) return null;
  
  const api = new MetaAdsAPI(TOKEN, accountId);
  
  // Fetch everything in parallel
  const [summary, campaigns, daily, audience] = await Promise.all([
    api.getInsights({ date_preset: datePreset }),
    api.getCampaignInsights({ date_preset: datePreset }),
    api.getDailyInsights({ date_preset: datePreset }),
    // api.getAudienceBreakdown({ date_preset: datePreset }) // To be implemented in meta.ts
    Promise.resolve([]) 
  ]);

  return {
    summary,
    campaigns,
    daily,
    audience
  };
}
