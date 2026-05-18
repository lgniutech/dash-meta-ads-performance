"use client";

import { useState } from "react";
import { Search, RefreshCw, MessageSquare, UtensilsCrossed, UserPlus, Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-50 no-export transition-all duration-500 border-b border-white/5">
        {/* Desktop & Mobile Brand Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={`/logos/logo-${brand}.png`} 
              alt={brand} 
              className="h-7 w-auto object-contain transition-all duration-500" 
              style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)' }}
            />
          </div>

          {/* Desktop Brand Switcher */}
          <button 
            onClick={onBrandToggle}
            className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-brand/20 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all group border border-white/5 hover:border-brand/40"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500 text-brand" />
            Alterar Marca
          </button>
        </div>

        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-6">
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

        {/* Desktop Date & Search (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-6">
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

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"
          >
            <Menu size={20} className="text-foreground" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col p-6 overflow-y-auto no-export lg:hidden transition-all duration-300">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <img 
              src={`/logos/logo-${brand}.png`} 
              alt={brand} 
              className="h-7 w-auto object-contain" 
              style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)' }}
            />
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Brand Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Marca Ativa</span>
              <button 
                onClick={() => {
                  onBrandToggle();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/5 hover:bg-brand/20 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5 hover:border-brand/40"
              >
                <RefreshCw size={14} className="text-brand animate-pulse" />
                Alterar Marca ({brand})
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Foco das Métricas</span>
              <div className="grid grid-cols-3 bg-white/5 rounded-2xl p-1 border border-white/5">
                <button 
                  onClick={() => { onModeToggle('food'); setIsOpen(false); }}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${mode === 'food' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'text-foreground/40'}`}
                >
                  <UtensilsCrossed size={14} /> Food
                </button>
                <button 
                  onClick={() => { onModeToggle('message'); setIsOpen(false); }}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${mode === 'message' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'text-foreground/40'}`}
                >
                  <MessageSquare size={14} /> Mensagens
                </button>
                <button 
                  onClick={() => { onModeToggle('followers'); setIsOpen(false); }}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${mode === 'followers' ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'text-foreground/40'}`}
                >
                  <UserPlus size={14} /> Seguidores
                </button>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Cliente / Conta de Anúncios</span>
              <AccountSelector onSelect={(id) => { onAccountChange(id); }} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Filtrar por Campanhas</span>
              <CampaignSelector 
                campaigns={campaigns.map(c => ({ id: c.campaign_id, name: c.campaign_name }))}
                selectedIds={selectedCampaigns}
                onChange={onCampaignChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider">Período de Análise</span>
              <DateSelector 
                value={datePreset} 
                onChange={onDateChange} 
                customRange={customRange}
                onCustomChange={onCustomChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
