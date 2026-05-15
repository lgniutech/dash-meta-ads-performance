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
    <nav className="flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-50 no-export transition-all duration-500">
      <div className="flex items-center gap-6">
        {/* Logo and Brand Toggle */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center text-black font-bold text-xl transition-all duration-500 shadow-[0_0_20px_rgba(var(--brand-color),0.4)]">
              {brand === 'weniu' ? '◆' : '●'}
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight uppercase leading-none">
                Relatório {brand}
              </span>
            </div>
          </div>

          <button 
            onClick={onBrandToggle}
            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-brand/20 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all group border border-white/5 hover:border-brand/40"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500 text-brand" />
            Alterar Marca
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

        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <Search size={20} className="text-foreground/20" />
        </button>
      </div>
    </nav>
  );
}
