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
  { label: "Máximo", value: "maximum" },
];

export function DateSelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = OPTIONS.find(o => o.value === value) || OPTIONS[3];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card border border-card-border rounded-2xl hover:border-brand/50 transition-colors text-sm text-foreground/70"
      >
        <Calendar size={16} className="text-brand" />
        <span>{selected.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[200px] bg-card border border-card-border rounded-2xl shadow-2xl z-[60] py-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-brand/10 text-sm transition-colors text-left"
            >
              <span className={value === opt.value ? 'text-brand font-medium' : ''}>{opt.label}</span>
              {value === opt.value && <Check size={14} className="text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
