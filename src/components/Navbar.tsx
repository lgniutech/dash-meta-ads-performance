"use client";

import { Search, RefreshCw } from "lucide-react";
import { AccountSelector } from "./AccountSelector";
import { CampaignSelector } from "./CampaignSelector";
import { DateSelector } from "./DateSelector";

interface NavbarProps {
  brand: string;
  onBrandToggle: () => void;
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
  brand,
  onBrandToggle,
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
    <nav className="flex items-center justify-between px-8 py-4 bg-background border-b border-card-border/10 sticky top-0 z-50 no-export transition-all duration-500">
      <div className="flex items-center gap-6">
        {/* Logo and Brand Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-background font-bold text-lg transition-colors duration-500">
              {brand === 'weniu' ? '◆' : '●'}
            </div>
            <span className="font-heading text-xl font-bold tracking-tight uppercase">
              Relatório {brand}
            </span>
          </div>

          <button 
            onClick={onBrandToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-card-border/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-brand/50 transition-all group"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            Mudar para {brand === 'weniu' ? 'weeat' : 'weniu'}
          </button>
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
          <Search size={20} className="text-foreground/30" />
        </button>
      </div>
    </nav>
  );
}
