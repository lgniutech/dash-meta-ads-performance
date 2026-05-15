"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "./Navbar";
import { getDashboardData } from "@/lib/actions";
import { Loader2 } from "lucide-react";

interface DashboardShellProps {
  children: (data: any, brand: string, mode: string) => React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [brand, setBrand] = useState("weniu");
  const [mode, setMode] = useState("food");
  const [accountId, setAccountId] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState("this_month");
  const [customRange, setCustomRange] = useState({ since: "", until: "" });

  // Dashboard Data State (Mock or Fetch)
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const range = datePreset === "custom" ? customRange : undefined;
        const result = await getDashboardData(accountId, datePreset, range);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [accountId, datePreset, customRange]);

  // Campaign Filtering Logic
  const filteredData = useMemo(() => {
    if (!data) return null;
    if (selectedCampaigns.length === 0) return data;

    const filteredCampaigns = data.campaigns.filter((c: any) => 
      selectedCampaigns.includes(c.campaign_id)
    );

    // Re-calculate summary based on selected campaigns
    const summary = filteredCampaigns.reduce((acc: any, curr: any) => {
      return {
        spend: (parseFloat(acc.spend || 0) + parseFloat(curr.spend || 0)).toString(),
        impressions: (parseInt(acc.impressions || 0) + parseInt(curr.impressions || 0)).toString(),
        clicks: (parseInt(acc.clicks || 0) + parseInt(curr.clicks || 0)).toString(),
        reach: (parseInt(acc.reach || 0) + parseInt(curr.reach || 0)).toString(), // Note: Reach isn't strictly additive across campaigns but we use it as a proxy
        ctr: 0, // Recalculated below
        frequency: 0, // Recalculated below
        actions: [...(acc.actions || []), ...(curr.actions || [])],
        action_values: [...(acc.action_values || []), ...(curr.action_values || [])],
        video_p25_watched_actions: [...(acc.video_p25_watched_actions || []), ...(curr.video_p25_watched_actions || [])],
        video_p50_watched_actions: [...(acc.video_p50_watched_actions || []), ...(curr.video_p50_watched_actions || [])],
        video_p75_watched_actions: [...(acc.video_p75_watched_actions || []), ...(curr.video_p75_watched_actions || [])],
        video_p100_watched_actions: [...(acc.video_p100_watched_actions || []), ...(curr.video_p100_watched_actions || [])],
        video_thruplay_watched_actions: [...(acc.video_thruplay_watched_actions || []), ...(curr.video_thruplay_watched_actions || [])],
      };
    }, { actions: [], action_values: [], video_p25_watched_actions: [], video_p50_watched_actions: [], video_p75_watched_actions: [], video_p100_watched_actions: [], video_thruplay_watched_actions: [] });

    // Proper CTR recalculation
    summary.ctr = (parseInt(summary.clicks || 0) / (parseInt(summary.impressions || 0) || 1)) * 100;
    
    return {
      ...data,
      summary,
      campaigns: filteredCampaigns
    };
  }, [data, selectedCampaigns]);

  return (
    <div className={`min-h-screen bg-background text-foreground selection:bg-brand/30 transition-colors duration-700 brand-${brand}`}>
      <div id="export-container" className="min-h-screen">
        <Navbar 
          brand={brand} 
          onBrandToggle={() => setBrand(b => b === 'weniu' ? 'weeat' : 'weniu')}
          mode={mode}
          onModeToggle={setMode}
          onAccountChange={setAccountId}
          campaigns={data?.campaigns || []}
          selectedCampaigns={selectedCampaigns}
          onCampaignChange={setSelectedCampaigns}
          datePreset={datePreset}
          onDateChange={setDatePreset}
          customRange={customRange}
          onCustomChange={setCustomRange}
        />
        
        <main className="max-w-[1600px] mx-auto px-8 mt-8 pb-20 relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-3xl">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-brand animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-brand">Atualizando Dados...</p>
              </div>
            </div>
          )}
          {children(filteredData, brand, mode)}
        </main>
      </div>
    </div>
  );
}
