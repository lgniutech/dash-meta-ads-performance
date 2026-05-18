"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getAccounts().then((data) => {
      setAccounts(data);
      if (data.length > 0) {
        setSelected(data[0]);
        onSelect(data[0].id);
      }
    });
  }, [onSelect]);

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (acc.business_name && acc.business_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="absolute top-full left-0 mt-2 w-[280px] bg-card border border-card-border rounded-2xl shadow-2xl z-[60] overflow-hidden flex flex-col">
          <div className="p-2 border-b border-card-border sticky top-0 bg-card z-10">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input 
                type="text"
                placeholder="Buscar conta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground outline-none focus:border-brand/50 placeholder:text-foreground/30"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto py-2">
            {filteredAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setSelected(acc);
                  onSelect(acc.id);
                  setIsOpen(false);
                  setSearchQuery(""); // clear search on select
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
            {filteredAccounts.length === 0 && (
              <div className="px-4 py-3 text-sm text-foreground/50 text-center">Nenhuma conta encontrada</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
