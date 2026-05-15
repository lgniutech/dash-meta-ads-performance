"use client";

import { TrendingUp, Users, MousePointer2, ShoppingCart, Target, Percent } from "lucide-react";
import { Card } from "./ui/Card";
import { fmtBRL, fmtNum, fmtPct } from "@/lib/utils";

const KPIS = [
  { label: "Investimento Total", value: 1250.43, icon: TrendingUp, change: 12.5, type: "currency" },
  { label: "Impressões", value: 116906, icon: Users, change: 5.2, type: "number" },
  { label: "Cliques", value: 1874, icon: MousePointer2, change: -2.1, type: "number" },
  { label: "Compras / Leads", value: 45, icon: ShoppingCart, change: 25.0, type: "number" },
  { label: "Custo por Compra", value: 27.78, icon: Target, change: -8.4, type: "currency" },
  { label: "ROAS / CTR", value: 4.2, icon: Percent, change: 1.5, type: "number", suffix: "x" },
];

export function KPISection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {KPIS.map((kpi, i) => (
        <Card key={kpi.label} className="flex flex-col gap-3 group hover:border-brand/30 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-brand-muted/50 rounded-xl text-brand group-hover:bg-brand group-hover:text-[#060e0e] transition-all duration-300">
              <kpi.icon size={20} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${kpi.change >= 0 ? 'text-brand' : 'text-red-400'}`}>
              {kpi.change >= 0 ? '+' : ''}{kpi.change}%
            </div>
          </div>
          
          <div>
            <p className="text-xs text-foreground/50 font-medium uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-2xl font-heading font-bold mt-1">
              {kpi.type === "currency" ? fmtBRL(kpi.value) : fmtNum(kpi.value)}
              {kpi.suffix}
            </h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
