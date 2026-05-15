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
}

export function ChartsSection({ daily = [], campaigns = [] }: ChartsProps) {
  // Format daily data for Recharts
  const dailyChartData = daily.map(d => ({
    date: new Date(d.date_start).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' }),
    spend: parseFloat(d.spend || 0),
  })).reverse();

  // Format campaign data for Pie (Top 5)
  const campaignChartData = campaigns
    .sort((a, b) => parseFloat(b.spend) - parseFloat(a.spend))
    .slice(0, 5)
    .map((c, i) => ({
      name: c.campaign_name,
      value: parseFloat(c.spend || 0),
      color: ["#03D967", "#002492", "#001B5E", "#004739", "#cbd5e1"][i % 5]
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Timeline */}
      <Card className="lg:col-span-2 shadow-2xl" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-bold">Evolução Diária</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand" /> Investimento (R$)
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyChartData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#03D967" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#03D967" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#002492" strokeOpacity={0.05} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#001B5E', fontSize: 10, fontWeight: 700, opacity: 0.4}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#001B5E', fontSize: 10, fontWeight: 700, opacity: 0.4}} tickFormatter={(v) => `R$ ${v}`} />
              <Tooltip 
                contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0, 36, 146, 0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,27,94,0.1)'}}
                itemStyle={{color: '#001B5E', fontWeight: 700}}
                formatter={(v: any) => [fmtBRL(v), "Investimento"]}
              />
              <Area 
                type="monotone" 
                dataKey="spend" 
                stroke="#03D967" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSpend)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Campaigns Pie */}
      <Card variant="glass" className="shadow-2xl">
        <h3 className="font-heading text-lg font-bold mb-6">Top 5 Campanhas (Gasto)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={campaignChartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
                animationDuration={1500}
              >
                {campaignChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0, 36, 146, 0.1)', borderRadius: '16px'}}
                formatter={(v: any) => [fmtBRL(v), "Gasto"]}
              />
              <Legend 
                verticalAlign="bottom" 
                iconType="circle"
                wrapperStyle={{fontSize: '10px', fontWeight: 700, paddingTop: '20px', color: '#001B5E'}}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
