"use client";

import { 
  TrendingUp, Users, MousePointer2, ShoppingCart, Target, Percent, Eye, Activity, 
  MessageSquare, Play, BarChart3, ArrowRight
} from "lucide-react";
import { Card } from "./ui/Card";
import { fmtBRL, fmtNum, getActionValue, safeDiv } from "@/lib/utils";

interface KPIProps {
  data: any;
}

export function KPISection({ data }: KPIProps) {
  const spend = parseFloat(data?.spend || 0);
  const impressions = parseInt(data?.impressions || 0);
  const clicks = parseInt(data?.clicks || 0);
  const reach = parseInt(data?.reach || 0);
  const frequency = parseFloat(data?.frequency || 0);
  
  // Conversion Metrics
  const purchases = getActionValue(data?.actions, "purchase");
  const leads = getActionValue(data?.actions, "lead");
  const msgs = getActionValue(data?.actions, "onsite_conversion.messaging_conversation_started_7d");
  const landingPageViews = getActionValue(data?.actions, "landing_page_view");
  
  const totalConversions = purchases + leads + msgs;
  
  const cpa = safeDiv(spend, totalConversions);
  const roas = getActionValue(data?.action_values, "purchase") / (spend || 1);
  const ctr = (clicks / (impressions || 1)) * 100;
  const cpc = safeDiv(spend, clicks);

  // Video Metrics
  const thruplays = getActionValue(data?.video_thruplay_watched_actions, "video_view");
  const p25 = getActionValue(data?.video_p25_watched_actions, "video_view");
  const p50 = getActionValue(data?.video_p50_watched_actions, "video_view");
  const p75 = getActionValue(data?.video_p75_watched_actions, "video_view");
  const p100 = getActionValue(data?.video_p100_watched_actions, "video_view");

  const primaryKpis = [
    { label: "Investimento", value: spend, icon: TrendingUp, type: "currency" },
    { label: "Impressões", value: impressions, icon: Users, type: "number" },
    { label: "Frequência", value: frequency.toFixed(2), icon: Activity, type: "number" },
    { label: "Resultados", value: totalConversions, icon: ShoppingCart, type: "number" },
    { label: "Custo / Res", value: cpa, icon: Target, type: "currency" },
    { label: "ROAS", value: roas.toFixed(2), icon: Percent, type: "number", suffix: "x" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {primaryKpis.map((kpi) => (
          <Card key={kpi.label} className="group hover:border-brand/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-brand/10 text-brand rounded-xl group-hover:bg-brand group-hover:text-black transition-colors">
                <kpi.icon size={18} />
              </div>
            </div>
            <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">{kpi.label}</p>
            <h3 className="text-xl font-heading font-bold mt-1">
              {kpi.type === "currency" ? fmtBRL(kpi.value) : fmtNum(kpi.value)}
              {kpi.suffix}
            </h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={20} className="text-brand" />
            <h3 className="font-heading text-lg font-bold">Funil de Conversão</h3>
          </div>
          
          <div className="space-y-4">
            <FunnelStep label="Alcance" value={reach} total={reach} icon={<Users size={14}/>} />
            <FunnelStep label="Cliques no Link" value={clicks} total={reach} icon={<MousePointer2 size={14}/>} />
            <FunnelStep label="Landing Page" value={landingPageViews} total={clicks} icon={<Eye size={14}/>} />
            <FunnelStep label="Resultados" value={totalConversions} total={landingPageViews} icon={<MessageSquare size={14}/>} highlight />
          </div>
        </Card>

        {/* Video Retention */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Play size={20} className="text-brand" />
            <h3 className="font-heading text-lg font-bold">Retenção de Vídeo</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <RetentionMetric label="25%" value={p25} total={impressions} />
              <RetentionMetric label="50%" value={p50} total={impressions} />
            </div>
            <div className="space-y-4">
              <RetentionMetric label="75%" value={p75} total={impressions} />
              <RetentionMetric label="100%" value={p100} total={impressions} />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-card-border/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-foreground/40 uppercase font-bold">ThruPlays</p>
              <p className="text-2xl font-heading font-bold text-brand">{fmtNum(thruplays)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-foreground/40 uppercase font-bold">Custo / ThruPlay</p>
              <p className="text-2xl font-heading font-bold">{fmtBRL(safeDiv(spend, thruplays))}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FunnelStep({ label, value, total, icon, highlight = false }: any) {
  const percentage = Math.min(100, safeDiv(value, total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className={highlight ? 'text-brand' : 'text-foreground/60'}>{icon}</span>
          <span className={highlight ? 'text-brand' : ''}>{label}</span>
        </div>
        <span>{fmtNum(value)} <span className="text-foreground/30 ml-2 font-medium">({percentage.toFixed(1)}%)</span></span>
      </div>
      <div className="h-1.5 bg-card-border/30 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${highlight ? 'bg-brand' : 'bg-brand/40'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function RetentionMetric({ label, value, total }: any) {
  const percentage = Math.min(100, safeDiv(value, total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-foreground/50 uppercase">{label}</span>
        <span className="text-[10px] font-bold text-brand">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-1 bg-card-border/30 rounded-full">
        <div className="h-full bg-brand rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
