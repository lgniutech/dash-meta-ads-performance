"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

const OPTIONS = [
  { label: "Hoje", value: "today" },
  { label: "Ontem", value: "yesterday" },
  { label: "Últimos 7 dias", value: "last_7d" },
  { label: "Últimos 30 dias", value: "last_30d" },
  { label: "Este mês", value: "this_month" },
  { label: "Mês passado", value: "last_month" },
  { label: "Personalizado", value: "custom" },
  { label: "Máximo", value: "maximum" },
];

interface DateSelectorProps {
  value: string;
  onChange: (v: string) => void;
  customRange: { since: string; until: string };
  onCustomChange: (range: { since: string; until: string }) => void;
}

export function DateSelector({ value, onChange, customRange, onCustomChange }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = OPTIONS.find(o => o.value === value) || OPTIONS[3];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card border border-card-border rounded-2xl hover:border-brand/50 transition-colors text-sm text-foreground/70"
      >
        <Calendar size={16} className="text-brand" />
        <span>{value === 'custom' ? `${customRange.since} - ${customRange.until}` : selected.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[240px] bg-card border border-card-border rounded-2xl shadow-2xl z-[60] py-2 overflow-hidden">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                if (opt.value !== 'custom') setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-brand/10 text-sm transition-colors text-left"
            >
              <span className={value === opt.value ? 'text-brand font-medium' : ''}>{opt.label}</span>
              {value === opt.value && <Check size={14} className="text-brand" />}
            </button>
          ))}

          {value === 'custom' && (
            <div className="p-4 bg-brand-muted/10 mt-2 border-t border-card-border space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground/40">Início</label>
                <input 
                  type="date" 
                  value={customRange.since}
                  onChange={(e) => onCustomChange({ ...customRange, since: e.target.value })}
                  className="w-full bg-[#060e0e] border border-card-border rounded-lg px-2 py-1 text-xs text-foreground outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-foreground/40">Fim</label>
                <input 
                  type="date" 
                  value={customRange.until}
                  onChange={(e) => onCustomChange({ ...customRange, until: e.target.value })}
                  className="w-full bg-[#060e0e] border border-card-border rounded-lg px-2 py-1 text-xs text-foreground outline-none focus:border-brand"
                />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-brand text-[#060e0e] rounded-xl text-xs font-bold hover:scale-[1.02] transition-transform"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
