"use client";

import { LayoutGrid, Calendar, ChevronDown, Bell, Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [activeAccount, setActiveAccount] = useState("CA SOLLO PIZZAS");

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#060e0e] border-b border-card-border sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-[#060e0e] font-bold">
            ◆
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">META ADS</span>
        </div>

        {/* Account Selector */}
        <div className="relative group">
          <button className="flex items-center gap-3 px-4 py-2 bg-card border border-card-border rounded-2xl hover:border-brand/50 transition-colors">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <span className="text-sm font-medium">{activeAccount}</span>
            <ChevronDown size={14} className="text-foreground/50" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Date Picker Placeholder */}
        <div className="flex items-center gap-3 px-4 py-2 bg-card border border-card-border rounded-2xl text-sm text-foreground/70">
          <Calendar size={16} className="text-brand" />
          <span>Últimos 30 dias (15 Mai - 14 Jun)</span>
          <ChevronDown size={14} />
        </div>

        {/* Utils */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-card rounded-xl transition-colors">
            <Search size={20} className="text-foreground/50" />
          </button>
          <button className="p-2 hover:bg-card rounded-xl transition-colors relative">
            <Bell size={20} className="text-foreground/50" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-[#060e0e]" />
          </button>
          <div className="w-10 h-10 bg-brand-muted rounded-2xl border border-brand/20 flex items-center justify-center font-bold text-brand">
            LG
          </div>
        </div>
      </div>
    </nav>
  );
}
