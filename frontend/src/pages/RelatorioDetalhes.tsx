/**
 * Página de detalhes de um relatório de métricas
 */

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { metricasService } from "@/services/metricasService";
import { areaService } from "@/services/areaService";
import { MetricsCards } from "@/components/MetricsCards";
import type { Metricas } from "@/types/metricas";
import type { Area } from "@/types/area";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const RelatorioDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const metricasData = await metricasService.getById(parseInt(id));
      setMetricas(metricasData);

      const areaData = await areaService.getById(metricasData.area_id);
      setArea(areaData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
      navigate("/relatorios");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  const exportToCSV = () => {
    if (!metricas || !area) return;

    const csvData = [
      ["Métrica", "Valor"],
      ["=== INFORMAÇÕES GERAIS ===", ""],
      ["ID do Relatório", metricas.id],
      ["Área", area.nome_area],
      ["Município", area.municipio],
      ["Estado", area.estado],
      ["Cultura Principal", area.cultura_principal || "N/A"],
      ["Período Início", metricas.periodo_inicio],
      ["Período Fim", metricas.periodo_fim],
      [""],
      ["=== NDVI - Índice de Vegetação por Diferença Normalizada ===", ""],
      ["NDVI Média", metricas.ndvi_mean ?? "N/A"],
      ["NDVI Mediana", metricas.ndvi_median ?? "N/A"],
      ["NDVI Desvio Padrão", metricas.ndvi_std ?? "N/A"],
      [""],
      ["=== EVI - Índice de Vegetação Melhorado ===", ""],
      ["EVI Média", metricas.evi_mean ?? "N/A"],
      ["EVI Mediana", metricas.evi_median ?? "N/A"],
      ["EVI Desvio Padrão", metricas.evi_std ?? "N/A"],
      [""],
      ["=== NDWI - Índice de Água por Diferença Normalizada ===", ""],
      ["NDWI Média", metricas.ndwi_mean ?? "N/A"],
      ["NDWI Mediana", metricas.ndwi_median ?? "N/A"],
      ["NDWI Desvio Padrão", metricas.ndwi_std ?? "N/A"],
      [""],
      ["=== NDMI - Índice de Umidade por Diferença Normalizada ===", ""],
      ["NDMI Média", metricas.ndmi_mean ?? "N/A"],
      ["NDMI Mediana", metricas.ndmi_median ?? "N/A"],
      ["NDMI Desvio Padrão", metricas.ndmi_std ?? "N/A"],
      [""],
      ["=== GNDVI - Índice de Vegetação Verde Normalizado ===", ""],
      ["GNDVI Média", metricas.gndvi_mean ?? "N/A"],
      ["GNDVI Mediana", metricas.gndvi_median ?? "N/A"],
      ["GNDVI Desvio Padrão", metricas.gndvi_std ?? "N/A"],
      [""],
      ["=== NDRE - Índice de Red Edge Normalizado ===", ""],
      ["NDRE Média", metricas.ndre_mean ?? "N/A"],
      ["NDRE Mediana", metricas.ndre_median ?? "N/A"],
      ["NDRE Desvio Padrão", metricas.ndre_std ?? "N/A"],
      [""],
      ["=== RENDVI - Índice Red Edge NDVI ===", ""],
      ["RENDVI Média", metricas.rendvi_mean ?? "N/A"],
      ["RENDVI Mediana", metricas.rendvi_median ?? "N/A"],
      ["RENDVI Desvio Padrão", metricas.rendvi_std ?? "N/A"],
      [""],
      ["=== ESTIMATIVAS ===", ""],
      ["Biomassa (t/ha)", metricas.biomassa ?? "N/A"],
      ["Cobertura Vegetal", metricas.cobertura_vegetal ?? "N/A"],
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio_${area.nome_area}_${metricas.periodo_inicio}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Relatório exportado",
      description: "O arquivo CSV foi baixado com sucesso",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!metricas || !area) {
    return (
      <Layout>
        <div className="p-8">
          <p className="text-center text-muted-foreground">Relatório não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/relatorios")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Relatórios
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Relatório de Métricas #{metricas.id}
              </h1>
              <p className="text-muted-foreground text-lg">
                {area.nome_area} - {area.municipio}/{area.estado}
              </p>
              {area.cultura_principal && (
                <p className="text-muted-foreground">
                  Cultura: {area.cultura_principal}
                </p>
              )}
            </div>
            
            <Button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Informações do Período */}
        <Card className="border-border mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Período de Análise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Início</p>
                <p className="text-lg font-semibold">{formatDate(metricas.periodo_inicio)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data de Fim</p>
                <p className="text-lg font-semibold">{formatDate(metricas.periodo_fim)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Cards de Métricas */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Índices de Vegetação</h2>
          <MetricsCards metricas={metricas} />
        </div>

        {/* Detalhes Expandidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NDVI */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">NDVI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Normalized Difference Vegetation Index - Mede a densidade e saúde da vegetação
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-semibold">{metricas.ndvi_mean?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="font-semibold">{metricas.ndvi_median?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desvio Padrão:</span>
                  <span className="font-semibold">{metricas.ndvi_std?.toFixed(4) || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* EVI */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">EVI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enhanced Vegetation Index - Minimiza influência do solo e atmosfera
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-semibold">{metricas.evi_mean?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="font-semibold">{metricas.evi_median?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desvio Padrão:</span>
                  <span className="font-semibold">{metricas.evi_std?.toFixed(4) || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* NDWI */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">NDWI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Normalized Difference Water Index - Detecta conteúdo de água
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-semibold">{metricas.ndwi_mean?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="font-semibold">{metricas.ndwi_median?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desvio Padrão:</span>
                  <span className="font-semibold">{metricas.ndwi_std?.toFixed(4) || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* NDMI */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">NDMI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Normalized Difference Moisture Index - Umidade da vegetação
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-semibold">{metricas.ndmi_mean?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="font-semibold">{metricas.ndmi_median?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desvio Padrão:</span>
                  <span className="font-semibold">{metricas.ndmi_std?.toFixed(4) || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* GNDVI */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">GNDVI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Green Normalized Difference Vegetation Index - Sensível ao clorofila
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-semibold">{metricas.gndvi_mean?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="font-semibold">{metricas.gndvi_median?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desvio Padrão:</span>
                  <span className="font-semibold">{metricas.gndvi_std?.toFixed(4) || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* NDRE */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">NDRE</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Normalized Difference Red Edge - Estresse e nitrogênio
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="font-semibold">{metricas.ndre_mean?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="font-semibold">{metricas.ndre_median?.toFixed(4) || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desvio Padrão:</span>
                  <span className="font-semibold">{metricas.ndre_std?.toFixed(4) || "N/A"}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RelatorioDetalhes;
