"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { KPISection } from "@/components/KPISection";
import { ChartsSection } from "@/components/ChartsSection";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Trophy, TrendingUp, Zap, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useCallback, useRef } from "react";

export default function Home() {
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(() => {
    const node = document.getElementById("dashboard-content");
    if (!node) return;

    // Filter out elements with 'no-export' class
    const filter = (node: HTMLElement) => {
      return !node.classList?.contains("no-export");
    };

    toPng(node, { 
      cacheBust: true, 
      backgroundColor: "#060e0e",
      filter: filter as any
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `relatorio-meta-ads-${new Date().toISOString().split('T')[0]}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Oops, something went wrong!", err);
      });
  }, []);

  return (
    <DashboardShell>
      {(data) => (
        <div className="flex flex-col gap-8" ref={exportRef}>
          {/* Header Title */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-heading font-extrabold tracking-tight">Dashboard de Performance</h1>
              <p className="text-foreground/50 mt-1">Visão geral do desempenho das suas campanhas no Meta Ads</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleExport}
                className="px-6 py-2.5 bg-brand text-[#060e0e] rounded-2xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Download size={16} /> Exportar PNG
              </button>
            </div>
          </motion.div>

          {/* KPIs */}
          <KPISection data={data?.summary} />

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <ChartsSection daily={data?.daily} campaigns={data?.campaigns} />
            </div>

            {/* Right Sidebar - Creative Champion */}
            <div className="flex flex-col gap-6">
              <Card variant="glass" className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-500/20 text-yellow-500 rounded-xl">
                    <Trophy size={20} />
                  </div>
                  <h3 className="font-heading text-lg font-bold">Criativo Campeão</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="aspect-video bg-card-border rounded-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-brand text-[#060e0e] rounded-xl font-bold text-sm">Ver Detalhes</button>
                    </div>
                    <div className="w-full h-full bg-brand-muted/20 flex items-center justify-center text-brand/30">
                      <Zap size={40} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-bold">Nenhum criativo selecionado</p>
                    <p className="text-[10px] text-foreground/40 italic">Selecione uma conta para ver dados reais</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-brand-muted/30 border-brand/20">
                <div className="flex items-center gap-2 text-brand mb-2">
                  <TrendingUp size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Growth Tip</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/70">
                  Dados reais serão analisados para fornecer insights personalizados baseados no seu ROI.
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
