"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card } from "./ui/Card";
import { fmtBRL } from "@/lib/utils";

interface ChartsProps {
  daily: any[];
  campaigns: any[];
  brand: string;
}

const PALETTES: Record<string, string[]> = {
  weniu: ['#03D967', '#004739', '#059669', '#10b981', '#34d399'],
  weeat: ['#f39424', '#f9ac54', '#f5b773', '#f4cc8c', '#fbbf24']
};

export function ChartsSection({ daily = [], campaigns = [], brand = 'weniu' }: ChartsProps) {
  const primaryColor = brand === 'weniu' ? '#03D967' : '#f39424';
  const palette = PALETTES[brand] || PALETTES.weniu;

  // Generate timeline based on data range
  const generateFullTimeline = () => {
    if (daily.length === 0) return [];
    
    // Get min and max dates from daily data
    const dates = daily.map(d => new Date(d.date_start).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    const timeline = [];
    let current = new Date(minDate);
    
    while (current <= maxDate) {
      const isoDate = current.toISOString().split('T')[0];
      const displayDate = current.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' });
      
      const existingData = daily.find(d => d.date_start === isoDate);
      timeline.push({
        date: displayDate,
        dateStr: isoDate,
        spend: existingData ? parseFloat(existingData.spend || 0) : 0
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    // If only one day or very short range, ensure at least 7 days for better visualization if possible
    // But for "This Month", we follow the data.
    
    return timeline;
  };

  const dailyChartData = generateFullTimeline();

  // Format campaign data for Pie (Top 5)
  const campaignChartData = [...campaigns]
    .sort((a, b) => parseFloat(b.spend) - parseFloat(a.spend))
    .slice(0, 5)
    .map((c, i) => ({
      name: c.campaign_name,
      value: parseFloat(c.spend || 0),
      color: palette[i % palette.length]
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Timeline */}
      <Card className="lg:col-span-2" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-bold text-foreground">Evolução Diária</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} /> Investimento (R$)
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#DCEFF6', fontSize: 10, fontWeight: 700, opacity: 0.3}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#DCEFF6', fontSize: 10, fontWeight: 700, opacity: 0.3}} 
                tickFormatter={(v) => `R$ ${v}`} 
              />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f0f0f', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)'}}
                itemStyle={{color: primaryColor, fontWeight: 700}}
                formatter={(v: any) => [fmtBRL(v), "Investimento"]}
              />
              <Area 
                type="monotone" 
                dataKey="spend" 
                stroke={primaryColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBrand)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Campaigns Pie */}
      <Card variant="glass" className="flex flex-col">
        <h3 className="font-heading text-lg font-bold mb-4 text-foreground">Top 5 Campanhas (Gasto)</h3>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={campaignChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                animationDuration={1500}
              >
                {campaignChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{backgroundColor: '#0f0f0f', border: 'none', borderRadius: '16px'}}
                formatter={(v: any) => [fmtBRL(v), "Gasto"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Clean Legend */}
        <div className="mt-4 flex flex-col gap-2.5">
          {campaignChartData.map((entry, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] font-bold text-foreground/40 truncate group-hover:text-foreground transition-colors uppercase tracking-tight">
                  {entry.name}
                </span>
              </div>
              <span className="text-[10px] font-bold text-foreground/70 ml-2">
                {fmtBRL(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
