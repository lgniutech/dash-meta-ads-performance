"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import { Navbar } from "./Navbar";
import { getDashboardData } from "@/lib/actions";

export function DashboardShell({ children }: { children: (data: any) => ReactNode }) {
  const [accountId, setAccountId] = useState("");
  const [campaignIds, setCampaignIds] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (id: string) => {
    if (!id) return;
    setIsLoading(true);
    const res = await getDashboardData(id);
    setData(res);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchData(accountId);
    }
  }, [accountId, fetchData]);

  // Filter data based on selected campaigns if needed
  // Note: For now we show account summary, but we could aggregate campaigns locally if filtered
  const filteredSummary = data?.summary || null;

  return (
    <div className="min-h-screen bg-[#060e0e] text-[#ddf0f0] font-sans pb-12">
      <Navbar 
        onAccountChange={setAccountId} 
        campaigns={data?.campaigns || []}
        selectedCampaigns={campaignIds}
        onCampaignChange={setCampaignIds}
      />
      
      <div className="max-w-[1600px] mx-auto px-8 mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children(data)
        )}
      </div>
    </div>
  );
}
