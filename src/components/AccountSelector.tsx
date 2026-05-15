"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { getAccounts } from "@/lib/actions";

interface Account {
  id: string;
  name: string;
  business_name?: string;
}

export function AccountSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<Account | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAccounts().then((data) => {
      setAccounts(data);
      if (data.length > 0) {
        setSelected(data[0]);
        onSelect(data[0].id);
      }
    });
  }, [onSelect]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-card border border-card-border rounded-2xl hover:border-brand/50 transition-colors min-w-[220px] justify-between"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-2 h-2 bg-brand rounded-full shrink-0" />
          <span className="text-sm font-medium truncate">
            {selected ? selected.name : "Carregando contas..."}
          </span>
        </div>
        <ChevronDown size={14} className={`text-foreground/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full max-h-[300px] overflow-y-auto bg-card border border-card-border rounded-2xl shadow-2xl z-[60] py-2">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => {
                setSelected(acc);
                onSelect(acc.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-brand/10 text-sm transition-colors text-left"
            >
              <div className="flex flex-col">
                <span className="font-medium">{acc.name}</span>
                <span className="text-[10px] text-foreground/40 uppercase">{acc.business_name || "Pessoal"}</span>
              </div>
              {selected?.id === acc.id && <Check size={14} className="text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
