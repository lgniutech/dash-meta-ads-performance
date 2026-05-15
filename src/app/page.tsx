"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { KPISection } from "@/components/KPISection";
import { ChartsSection } from "@/components/ChartsSection";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Trophy, Zap, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useCallback } from "react";

export default function Home() {
  const handleExport = useCallback((brand: string) => {
    const node = document.getElementById("dashboard-content");
    if (!node) return;

    const filter = (node: HTMLElement) => {
      return !node.classList?.contains("no-export");
    };

    // Improve capture quality and ensure full height
    toPng(node, { 
      cacheBust: true, 
      backgroundColor: "#000000",
      filter: filter as any,
      pixelRatio: 2, // Higher quality
      skipFonts: false,
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
      {(data, brand, mode) => {
        const bestAd = data?.ads?.[0] || null;
        const creative = bestAd?.creative;
        const creativeUrl = creative?.image_url || creative?.thumbnail_url;

        return (
          <div className="flex flex-col gap-8 pb-20"> {/* Added padding to ensure bottom capture */}
            {/* Header Title with Logo (Enlarged) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <img 
                  src={`/logos/logo-${brand}.png`} 
                  alt={brand} 
                  className="h-28 w-auto object-contain transition-all duration-500" 
                  style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)' }}
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleExport(brand)}
                  className="no-export px-6 py-2.5 bg-brand text-black rounded-2xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-[0_10px_25px_rgba(var(--brand-color),0.2)]"
                >
                  <Download size={16} /> Exportar PNG
                </button>
              </div>
            </motion.div>

            {/* KPIs and Funnel */}
            <KPISection data={data?.summary} brand={brand} mode={mode} />

            {/* Charts and Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <ChartsSection daily={data?.daily} campaigns={data?.campaigns} brand={brand} />
              </div>

              {/* Sidebar - Creative Champion */}
              <div className="flex flex-col gap-6">
                <Card variant="glass" className="flex-1 overflow-hidden group">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl">
                      <Trophy size={20} />
                    </div>
                    <h3 className="font-heading text-lg font-bold">Criativo Campeão</h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/5] bg-white/5 rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-brand/20 transition-colors">
                      {creativeUrl ? (
                        <img 
                          src={creativeUrl} 
                          alt="Champion Creative" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand/10">
                          <Zap size={48} className="animate-pulse" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>
                    
                    <div className="space-y-1 px-1">
                      <p className="text-xs font-bold truncate text-foreground/90">{bestAd?.name || "Buscando o melhor criativo..."}</p>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                         <p className="text-[9px] text-foreground/40 uppercase font-bold tracking-widest">Melhor Performance da Conta</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      }}
    </DashboardShell>
  );
}
