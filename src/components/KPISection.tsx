"use client";

import { 
  TrendingUp, Users, MousePointer2, ShoppingCart, Target, Percent, Eye, Activity, 
  MessageSquare, Play, BarChart3, Banknote, MessageCircle, MousePointer
} from "lucide-react";
import { Card } from "./ui/Card";
import { fmtBRL, fmtNum, getActionValue, safeDiv } from "@/lib/utils";

interface KPIProps {
  data: any;
  brand: string;
  mode: string;
}

export function KPISection({ data, brand, mode }: KPIProps) {
  const brandColor = brand === 'weniu' ? '#03D967' : '#f39424';

  const spend = parseFloat(data?.spend || 0);
  const impressions = parseInt(data?.impressions || 0);
  const clicks = parseInt(data?.clicks || 0);
  const reach = parseInt(data?.reach || 0);
  const frequency = parseFloat(data?.frequency || 0);
  const ctr = parseFloat(data?.ctr || 0);
  
  // Conversion Metrics
  const purchases = getActionValue(data?.actions, ["purchase", "offsite_conversion.fb_pixel_purchase", "onsite_web_purchase"]);
  const leads = getActionValue(data?.actions, ["lead", "offsite_conversion.fb_pixel_lead"]);
  const msgs = getActionValue(data?.actions, ["onsite_conversion.messaging_conversation_started_7d", "messaging_conversation_started_7d"]);
  
  // Faturamento (Purchase Value)
  const revenue = getActionValue(data?.action_values, ["purchase", "offsite_conversion.fb_pixel_purchase"]);

  // Landing Page fallback
  let lpViews = getActionValue(data?.actions, ["landing_page_view", "omni_landing_page_view"]);
  if (lpViews === 0) {
    lpViews = getActionValue(data?.actions, ["view_content", "offsite_conversion.fb_pixel_view_content"]);
  }
  
  const totalConversions = purchases + leads + msgs;
  const cpa = safeDiv(spend, totalConversions);
  const roas = safeDiv(revenue, spend);
  const costPerMsg = safeDiv(spend, msgs);

  // Dynamic KPIs based on mode - ELIMINATING REDUNDANCY
  const primaryKpis = mode === 'food' ? [
    { label: "Investimento", value: spend, icon: TrendingUp, type: "currency" },
    { label: "Impressões", value: impressions, icon: Users, type: "number" },
    { label: "Faturamento", value: revenue, icon: Banknote, type: "currency" },
    { label: "Resultados", value: totalConversions, icon: ShoppingCart, type: "number" },
    { label: "Custo / Res", value: cpa, icon: Target, type: "currency" },
    { label: "ROAS", value: roas.toFixed(2), icon: Percent, type: "number", suffix: "x" },
  ] : [
    { label: "Investimento", value: spend, icon: TrendingUp, type: "currency" },
    { label: "Impressões", value: impressions, icon: Users, type: "number" },
    { label: "Iniciadas", value: msgs, icon: MessageCircle, type: "number" },
    { label: "Cliques (Link)", value: clicks, icon: MousePointer, type: "number" },
    { label: "CTR", value: ctr.toFixed(2), icon: Percent, type: "number", suffix: "%" },
    { label: "Custo / Msg", value: costPerMsg, icon: MessageSquare, type: "currency" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {primaryKpis.map((kpi) => (
          <Card key={kpi.label} className="group transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 transition-colors" style={{ color: brandColor }}>
                <kpi.icon size={22} />
              </div>
            </div>
            <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">{kpi.label}</p>
            <h3 className="text-xl font-heading font-bold mt-1 text-foreground">
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
            <BarChart3 size={20} style={{ color: brandColor }} />
            <h3 className="font-heading text-lg font-bold">Funil de Conversão ({mode === 'food' ? 'Vendas' : 'Mensagens'})</h3>
          </div>
          
          <div className="space-y-4">
            <FunnelStep label="Alcance" value={reach} total={reach} icon={<Users size={14}/>} brandColor={brandColor} />
            <FunnelStep label="Cliques no Link" value={clicks} total={reach} icon={<MousePointer2 size={14}/>} brandColor={brandColor} />
            {mode === 'food' && <FunnelStep label="Landing Page" value={lpViews} total={clicks} icon={<Eye size={14}/>} brandColor={brandColor} />}
            <FunnelStep 
              label={mode === 'food' ? "Resultados" : "Contatos WhatsApp"} 
              value={mode === 'food' ? totalConversions : msgs} 
              total={mode === 'food' ? lpViews || clicks : clicks} 
              icon={<MessageSquare size={14}/>} 
              highlight 
              brandColor={brandColor} 
            />
          </div>
        </Card>

        {/* Video Retention */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Play size={20} style={{ color: brandColor }} />
            <h3 className="font-heading text-lg font-bold">Retenção de Vídeo</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <RetentionMetric label="25%" value={p25} total={impressions} brandColor={brandColor} />
              <RetentionMetric label="50%" value={p50} total={impressions} brandColor={brandColor} />
            </div>
            <div className="space-y-4">
              <RetentionMetric label="75%" value={p75} total={impressions} brandColor={brandColor} />
              <RetentionMetric label="100%" value={p100} total={impressions} brandColor={brandColor} />
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-foreground/40 uppercase font-bold">ThruPlays</p>
              <p className="text-2xl font-heading font-bold" style={{ color: brandColor }}>{fmtNum(thruplays)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-foreground/40 uppercase font-bold">Custo / ThruPlay</p>
              <p className="text-2xl font-heading font-bold text-foreground">{fmtBRL(safeDiv(spend, thruplays))}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FunnelStep({ label, value, total, icon, highlight = false, brandColor }: any) {
  const percentage = Math.min(100, safeDiv(value, total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span style={{ color: brandColor }}>{icon}</span>
          <span className={highlight ? '' : 'text-foreground/70'} style={highlight ? { color: brandColor } : {}}>{label}</span>
        </div>
        <span className="text-foreground/80">{fmtNum(value)} <span className="text-foreground/30 ml-2 font-medium">({percentage.toFixed(1)}%)</span></span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000" 
          style={{ width: `${percentage}%`, backgroundColor: highlight ? brandColor : `${brandColor}4D` }}
        />
      </div>
    </div>
  );
}

function RetentionMetric({ label, value, total, brandColor }: any) {
  const percentage = Math.min(100, safeDiv(value, total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold text-foreground/40 uppercase">{label}</span>
        <span className="text-[9px] font-bold" style={{ color: brandColor }}>{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%`, backgroundColor: brandColor }} />
      </div>
    </div>
  );
}
