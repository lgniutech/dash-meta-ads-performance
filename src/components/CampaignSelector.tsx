"use client";

import { useState } from "react";
import { ChevronDown, Check, Filter } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
}

interface CampaignSelectorProps {
  campaigns: Campaign[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function CampaignSelector({ campaigns, selectedIds, onChange }: CampaignSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedCount = selectedIds.length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#141414] lg:bg-card border border-white/10 lg:border-card-border rounded-2xl hover:border-brand/50 transition-colors min-w-[200px] justify-between w-full"
      >
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-brand" />
          <span className="text-sm font-medium">
            {selectedCount === 0 ? "Todas as Campanhas" : `${selectedCount} Selecionadas`}
          </span>
        </div>
        <ChevronDown size={14} className={`text-foreground/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[300px] max-h-[300px] overflow-y-auto bg-[#141414] lg:bg-card border border-white/10 lg:border-card-border rounded-2xl shadow-2xl z-[60] py-2">
          <button
            onClick={() => onChange([])}
            className="w-full flex items-center px-4 py-2 hover:bg-brand/10 text-xs font-bold text-brand transition-colors uppercase"
          >
            Limpar Seleção
          </button>
          <div className="h-px bg-card-border my-1" />
          {campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-brand/10 text-sm transition-colors text-left"
            >
              <span className={`truncate ${selectedIds.includes(c.id) ? 'text-brand font-medium' : 'text-foreground/70'}`}>
                {c.name}
              </span>
              {selectedIds.includes(c.id) && <Check size={14} className="text-brand shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
