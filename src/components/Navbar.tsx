"use client";

import { Search } from "lucide-react";
import { AccountSelector } from "./AccountSelector";
import { CampaignSelector } from "./CampaignSelector";
import { DateSelector } from "./DateSelector";

interface NavbarProps {
  onAccountChange: (id: string) => void;
  campaigns: any[];
  selectedCampaigns: string[];
  onCampaignChange: (ids: string[]) => void;
  datePreset: string;
  onDateChange: (v: string) => void;
  customRange: { since: string; until: string };
  onCustomChange: (range: { since: string; until: string }) => void;
}

export function Navbar({ 
  onAccountChange, 
  campaigns, 
  selectedCampaigns, 
  onCampaignChange,
  datePreset,
  onDateChange,
  customRange,
  onCustomChange
}: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#000000] border-b border-card-border/30 sticky top-0 z-50 no-export">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-black font-bold text-lg">
            ◆
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">Relatório weniu</span>
        </div>

        {/* Selectors */}
        <div className="flex items-center gap-3">
          <AccountSelector onSelect={onAccountChange} />
          <CampaignSelector 
            campaigns={campaigns.map(c => ({ id: c.campaign_id, name: c.campaign_name }))}
            selectedIds={selectedCampaigns}
            onChange={onCampaignChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <DateSelector 
          value={datePreset} 
          onChange={onDateChange} 
          customRange={customRange}
          onCustomChange={onCustomChange}
        />

        <button className="p-2 hover:bg-card rounded-xl transition-colors">
          <Search size={20} className="text-foreground/50" />
        </button>
      </div>
    </nav>
  );
}
