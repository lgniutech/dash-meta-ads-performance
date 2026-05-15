"use client";

import { Search, RefreshCw, MessageSquare, UtensilsCrossed, UserPlus } from "lucide-react";
import { AccountSelector } from "./AccountSelector";
import { CampaignSelector } from "./CampaignSelector";
import { DateSelector } from "./DateSelector";

interface NavbarProps {
  brand: string;
  onBrandToggle: () => void;
  mode: string;
  onModeToggle: (mode: string) => void;
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
  mode,
  onModeToggle,
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
            <img 
              src={`/logos/logo-${brand}.png`} 
              alt={brand} 
              className="h-7 w-auto object-contain transition-all duration-500" 
              style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)' }}
            />
          </div>

          <button 
            onClick={onBrandToggle}
            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-brand/20 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all group border border-white/5 hover:border-brand/40"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500 text-brand" />
            Alterar Marca
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
          <button 
            onClick={() => onModeToggle('food')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'food' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'text-foreground/40 hover:text-foreground'}`}
          >
            <UtensilsCrossed size={12} /> Food
          </button>
          <button 
            onClick={() => onModeToggle('message')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'message' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'text-foreground/40 hover:text-foreground'}`}
          >
            <MessageSquare size={12} /> Mensagens
          </button>
          <button 
            onClick={() => onModeToggle('followers')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'followers' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'text-foreground/40 hover:text-foreground'}`}
          >
            <UserPlus size={12} /> Seguidores
          </button>
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2" />

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
        <div className="flex items-center gap-6 pr-4">
           <DateSelector 
            value={datePreset} 
            onChange={onDateChange} 
            customRange={customRange}
            onCustomChange={onCustomChange}
          />
        </div>

        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <Search size={20} className="text-foreground/20" />
        </button>
      </div>
    </nav>
  );
}
