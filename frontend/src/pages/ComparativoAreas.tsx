/**
 * Página de comparativo entre múltiplas áreas
 */

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import { MetricsComparisonChart } from "@/components/MetricsComparisonChart";
import { ComparisonTable } from "@/components/ComparisonTable";
import { metricasService } from "@/services/metricasService";
import { areaService } from "@/services/areaService";
import type { Metricas } from "@/types/metricas";
import type { Area } from "@/types/area";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const ComparativoAreas = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [metricas, setMetricas] = useState<Metricas[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadData = async () => {
    const areaIdsParam = searchParams.get("areas");
    if (!areaIdsParam) {
      navigate("/relatorios");
      return;
    }

    const areaIds = areaIdsParam.split(",").map(Number);
    if (areaIds.length < 2) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "É necessário selecionar pelo menos 2 áreas para comparação",
      });
      navigate("/relatorios");
      return;
    }

    setIsLoading(true);
    try {
      // Carregar todas as áreas e métricas
      const [allAreas, allMetricas] = await Promise.all([
        areaService.getAll(),
        metricasService.getAll(),
      ]);

      // Filtrar áreas selecionadas
      const selectedAreas = allAreas.filter(a => areaIds.includes(a.id));
      if (selectedAreas.length !== areaIds.length) {
        throw new Error("Algumas áreas não foram encontradas");
      }

      // Para cada área, pegar a métrica mais recente
      const latestMetricas: Metricas[] = [];
      for (const area of selectedAreas) {
        const areaMetricas = allMetricas
          .filter(m => m.area_id === area.id)
          .sort((a, b) => {
            const dateA = new Date(a.periodo_fim).getTime();
            const dateB = new Date(b.periodo_fim).getTime();
            return dateB - dateA;
          });

        if (areaMetricas.length > 0) {
          latestMetricas.push(areaMetricas[0]);
        } else {
          toast({
            variant: "destructive",
            title: "Aviso",
            description: `A área "${area.nome_area}" não possui métricas calculadas`,
          });
        }
      }

      if (latestMetricas.length < 2) {
        throw new Error("É necessário ter métricas calculadas para pelo menos 2 áreas");
      }

      setAreas(selectedAreas);
      setMetricas(latestMetricas);
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

  const exportToExcel = () => {
    const csvData: string[][] = [
      ["RELATÓRIO COMPARATIVO DE ÁREAS"],
      [""],
      ["Gerado em:", new Date().toLocaleString("pt-BR")],
      [""],
      ["=== ÁREAS COMPARADAS ==="],
      [""],
    ];

    // Informações das áreas
    areas.forEach((area, idx) => {
      csvData.push([`Área ${idx + 1}:`, area.nome_area]);
      csvData.push(["Município:", area.municipio]);
      csvData.push(["Estado:", area.estado]);
      csvData.push(["Cultura:", area.cultura_principal || "N/A"]);
      csvData.push([""]);
    });

    csvData.push(["=== COMPARAÇÃO DE MÉTRICAS ==="], [""]);

    // Cabeçalho da tabela
    const header = ["Métrica", ...areas.map(a => a.nome_area)];
    csvData.push(header);

    // Dados
    const metrics = [
      { label: "NDVI Média", key: "ndvi_mean" },
      { label: "NDVI Mediana", key: "ndvi_median" },
      { label: "EVI Média", key: "evi_mean" },
      { label: "EVI Mediana", key: "evi_median" },
      { label: "NDWI Média", key: "ndwi_mean" },
      { label: "NDMI Média", key: "ndmi_mean" },
      { label: "GNDVI Média", key: "gndvi_mean" },
      { label: "NDRE Média", key: "ndre_mean" },
      { label: "RENDVI Média", key: "rendvi_mean" },
      { label: "Biomassa (t/ha)", key: "biomassa" },
    ];

    metrics.forEach(({ label, key }) => {
      const row = [
        label,
        ...metricas.map(m => {
          const value = m[key as keyof Metricas];
          return value !== null && value !== undefined ? String(value) : "N/A";
        }),
      ];
      csvData.push(row);
    });

    csvData.push([""]);
    csvData.push(["=== PERÍODOS DE ANÁLISE ==="]);
    csvData.push([""]);

    metricas.forEach((m, idx) => {
      const area = areas[idx];
      csvData.push([area.nome_area + ":"]);
      csvData.push(["Início:", m.periodo_inicio]);
      csvData.push(["Fim:", m.periodo_fim]);
      csvData.push([""]);
    });

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `comparativo_areas_${new Date().getTime()}.csv`);
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
                Relatório Comparativo
              </h1>
              <p className="text-muted-foreground text-lg">
                Comparação entre {areas.length} área(s)
              </p>
            </div>

            <Button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel/CSV
            </Button>
          </div>
        </div>

        {/* Informações das Áreas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {areas.map((area, idx) => {
            const metrica = metricas[idx];
            return (
              <Card key={area.id} className="border-border p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">{area.nome_area}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Área {idx + 1}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Local:</strong> {area.municipio}/{area.estado}
                  </p>
                  {area.cultura_principal && (
                    <p className="text-muted-foreground">
                      <strong>Cultura:</strong> {area.cultura_principal}
                    </p>
                  )}
                  {metrica && (
                    <>
                      <p className="text-muted-foreground mt-2">
                        <strong>Período:</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(metrica.periodo_inicio), "dd/MM/yyyy", { locale: ptBR })} até{" "}
                        {format(parseISO(metrica.periodo_fim), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Gráficos de Comparação */}
        <div className="mb-8">
          <MetricsComparisonChart metricas={metricas} areas={areas} />
        </div>

        {/* Tabela Comparativa */}
        <ComparisonTable metricas={metricas} areas={areas} />
      </div>
    </Layout>
  );
};

export default ComparativoAreas;
