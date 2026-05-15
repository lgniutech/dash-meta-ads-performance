"use client";

import { TrendingUp, Users, MousePointer2, ShoppingCart, Target, Percent, Eye, Activity } from "lucide-react";
import { Card } from "./ui/Card";
import { fmtBRL, fmtNum, getActionValue, safeDiv } from "@/lib/utils";

interface KPIProps {
  data: any;
}

export function KPISection({ data }: KPIProps) {
  const spend = parseFloat(data?.spend || 0);
  const impressions = parseInt(data?.impressions || 0);
  const clicks = parseInt(data?.clicks || 0);
  
  const purchases = getActionValue(data?.actions, "purchase") || getActionValue(data?.actions, "onsite_conversion.fb_pixel_purchase");
  const leads = getActionValue(data?.actions, "lead") || getActionValue(data?.actions, "onsite_conversion.lead");
  const totalConversions = purchases + leads;
  
  const cpa = safeDiv(spend, totalConversions);
  const roas = getActionValue(data?.action_values, "purchase") / (spend || 1);
  const ctr = (clicks / (impressions || 1)) * 100;

  const kpis = [
    { label: "Investimento Total", value: spend, icon: TrendingUp, type: "currency" },
    { label: "Impressões", value: impressions, icon: Users, type: "number" },
    { label: "Cliques", value: clicks, icon: MousePointer2, type: "number" },
    { label: "Compras / Leads", value: totalConversions, icon: ShoppingCart, type: "number" },
    { label: "Custo por Conversão", value: cpa, icon: Target, type: "currency" },
    { label: "ROAS (Compras)", value: roas.toFixed(2), icon: Percent, type: "number", suffix: "x" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={kpi.label} className="flex flex-col gap-3 group hover:border-brand/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-brand-muted/50 rounded-xl text-brand group-hover:bg-brand group-hover:text-[#060e0e] transition-all duration-300">
                <kpi.icon size={20} />
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

      {/* Secondary / Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4 py-4 px-6 border-brand/10 bg-brand-muted/10">
          <div className="p-2 bg-brand/10 text-brand rounded-lg"><Eye size={16} /></div>
          <div>
            <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">CTR Médio</p>
            <p className="text-lg font-heading font-bold">{ctr.toFixed(2)}%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 py-4 px-6 border-brand/10 bg-brand-muted/10">
          <div className="p-2 bg-brand/10 text-brand rounded-lg"><Activity size={16} /></div>
          <div>
            <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">CPM</p>
            <p className="text-lg font-heading font-bold">{fmtBRL(safeDiv(spend, impressions) * 1000)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
