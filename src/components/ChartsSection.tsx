"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { Card } from "./ui/Card";

const DAILY_DATA = [
  { date: "01/06", spend: 400, conversions: 12 },
  { date: "02/06", spend: 300, conversions: 8 },
  { date: "03/06", spend: 500, conversions: 15 },
  { date: "04/06", spend: 450, conversions: 11 },
  { date: "05/06", spend: 600, conversions: 22 },
  { date: "06/06", spend: 550, conversions: 19 },
  { date: "07/06", spend: 700, conversions: 25 },
];

const CAMPAIGN_DATA = [
  { name: "Frio - Lookalike", value: 450, color: "#3ddb6e" },
  { name: "Quente - Remarketing", value: 300, color: "#10b981" },
  { name: "Frio - Interesses", value: 300, color: "#064e3b" },
  { name: "Manual - Vendas", value: 200, color: "#1a4040" },
];

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Timeline */}
      <Card className="lg:col-span-2" variant="glass">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg font-bold">Evolução Diária</h3>
          <div className="flex items-center gap-4 text-xs font-medium text-foreground/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand" /> Investimento
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DAILY_DATA}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ddb6e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3ddb6e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a4040" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#889999', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#889999', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#0c2020', border: '1px solid #1a4040', borderRadius: '12px'}}
                itemStyle={{color: '#ddf0f0'}}
              />
              <Area 
                type="monotone" 
                dataKey="spend" 
                stroke="#3ddb6e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSpend)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Campaigns Pie */}
      <Card variant="glass">
        <h3 className="font-heading text-lg font-bold mb-6">Distribuição por Campanha</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CAMPAIGN_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {CAMPAIGN_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{backgroundColor: '#0c2020', border: '1px solid #1a4040', borderRadius: '12px'}}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
