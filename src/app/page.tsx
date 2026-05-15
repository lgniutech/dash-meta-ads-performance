"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { KPISection } from "@/components/KPISection";
import { ChartsSection } from "@/components/ChartsSection";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Trophy, TrendingUp, Zap, Download, ExternalLink } from "lucide-react";
import { toPng } from "html-to-image";
import { useCallback } from "react";

export default function Home() {
  const handleExport = useCallback((brand: string) => {
    const node = document.getElementById("dashboard-content");
    if (!node) return;

    const filter = (node: HTMLElement) => {
      return !node.classList?.contains("no-export");
    };

    const bgColor = brand === 'weniu' ? "#000000" : "#fbf3e8";

    toPng(node, { 
      cacheBust: true, 
      backgroundColor: bgColor,
      filter: filter as any
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `relatorio-${brand}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Export failed", err);
      });
  }, []);

  return (
    <DashboardShell>
      {(data, brand) => {
        const bestAd = data?.ads?.[0] || null;
        const creative = bestAd?.creative;
        const creativeUrl = creative?.image_url || creative?.thumbnail_url;

        return (
          <div className="flex flex-col gap-8">
            {/* Header Title */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-heading font-extrabold tracking-tight">Relatório {brand}</h1>
                <p className="text-foreground/50 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">
                  {brand === 'weniu' ? 'Data-Driven Performance Command Center' : 'Growth & Nutrition Intelligence Hub'}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleExport(brand)}
                  className="px-6 py-2.5 bg-brand text-background rounded-2xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(var(--brand-color),0.3)]"
                >
                  <Download size={16} /> Exportar PNG
                </button>
              </div>
            </motion.div>

            {/* KPIs and Funnel */}
            <KPISection data={data?.summary} />

            {/* Charts and Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <ChartsSection daily={data?.daily} campaigns={data?.campaigns} />
              </div>

              {/* Sidebar - Creative Champion */}
              <div className="flex flex-col gap-6">
                <Card variant="glass" className="flex-1 overflow-hidden group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl">
                      <Trophy size={20} />
                    </div>
                    <h3 className="font-heading text-lg font-bold">Criativo Campeão</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/5] bg-card-border/10 rounded-2xl overflow-hidden relative border border-card-border/20">
                      {creativeUrl ? (
                        <img 
                          src={creativeUrl} 
                          alt="Champion Creative" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand/20">
                          <Zap size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <button className="w-full py-2 bg-brand/10 backdrop-blur-md border border-brand/20 text-foreground rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand/20 transition-colors">
                          <ExternalLink size={14} /> Ver na Biblioteca
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 p-2">
                      <p className="text-xs font-bold truncate">{bestAd?.name || "Buscando o melhor criativo..."}</p>
                      <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-widest">Melhor CTR da conta</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-brand/5 border-brand/20">
                  <div className="flex items-center gap-2 text-brand mb-2">
                    <TrendingUp size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{brand} Insight</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/70">
                    O criativo acima está gerando um engajamento superior à média. Considere duplicar o público.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        );
      }}
    </DashboardShell>
  );
}
