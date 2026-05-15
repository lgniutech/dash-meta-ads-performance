"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";

interface DashboardShellProps {
  children: (data: any, brand: string, mode: string) => React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [brand, setBrand] = useState("weniu");
  const [mode, setMode] = useState("food");
  const [accountId, setAccountId] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState("last_30d");
  const [customRange, setCustomRange] = useState({ since: "", until: "" });

  // Dashboard Data State (Mock or Fetch)
  const [data, setData] = useState<any>(null);

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
        
        <main className="max-w-[1600px] mx-auto px-8 mt-8 pb-20">
          {children(data, brand, mode)}
        </main>
      </div>
    </div>
  );
}
