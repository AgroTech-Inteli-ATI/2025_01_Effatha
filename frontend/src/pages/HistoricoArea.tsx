/**
 * Página de Histórico Temporal de uma Área
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, TrendingUp, TrendingDown, Minus, Download } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area as RechartsArea,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { metricasService } from "@/services/metricasService";
import { areaService } from "@/services/areaService";
import type { Metricas } from "@/types/metricas";
import type { Area } from "@/types/area";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const HistoricoArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [area, setArea] = useState<Area | null>(null);
  const [metricas, setMetricas] = useState<Metricas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const areaData = await areaService.getById(parseInt(id));
      setArea(areaData);

      const metricasData = await metricasService.getByArea(parseInt(id));
      
      if (metricasData.length === 0) {
        toast({
          variant: "destructive",
          title: "Sem dados",
          description: "Esta área ainda não possui métricas calculadas",
        });
      }

      // Ordenar por data
      const sortedMetricas = metricasData.sort((a, b) => {
        return new Date(a.periodo_fim).getTime() - new Date(b.periodo_fim).getTime();
      });

      setMetricas(sortedMetricas);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
      navigate("/areas");
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = () => {
    return metricas.map((m) => ({
      date: format(parseISO(m.periodo_fim), "dd/MM/yy", { locale: ptBR }),
      fullDate: format(parseISO(m.periodo_fim), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
      ndvi: m.ndvi_mean,
      evi: m.evi_mean,
      ndwi: m.ndwi_mean,
      ndmi: m.ndmi_mean,
      gndvi: m.gndvi_mean,
      ndre: m.ndre_mean,
      rendvi: m.rendvi_mean,
      biomassa: m.biomassa,
    }));
  };

  const calculateTrend = (metricKey: keyof Metricas): { 
    trend: "up" | "down" | "stable"; 
    percentage: number;
    value: number | null;
  } => {
    if (metricas.length < 2) {
      return { trend: "stable", percentage: 0, value: null };
    }

    const latest = metricas[metricas.length - 1];
    const previous = metricas[metricas.length - 2];

    const latestValue = latest[metricKey] as number | null;
    const previousValue = previous[metricKey] as number | null;

    if (latestValue === null || previousValue === null) {
      return { trend: "stable", percentage: 0, value: latestValue };
    }

    const diff = latestValue - previousValue;
    const percentage = previousValue !== 0 ? (diff / Math.abs(previousValue)) * 100 : 0;

    let trend: "up" | "down" | "stable" = "stable";
    if (Math.abs(percentage) > 2) {
      trend = diff > 0 ? "up" : "down";
    }

    return { trend, percentage: Math.abs(percentage), value: latestValue };
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const exportHistoryToCSV = () => {
    if (!area) return;

    const csvData: string[][] = [
      ["HISTÓRICO TEMPORAL DE MÉTRICAS"],
      [""],
      ["Área:", area.nome_area],
      ["Município:", area.municipio],
      ["Estado:", area.estado],
      ["Cultura:", area.cultura_principal || "N/A"],
      [""],
      ["=== EVOLUÇÃO DAS MÉTRICAS ==="],
      [""],
      [
        "Data Fim",
        "Período (dias)",
        "NDVI Média",
        "EVI Média",
        "NDWI Média",
        "NDMI Média",
        "GNDVI Média",
        "NDRE Média",
        "RENDVI Média",
        "Biomassa (t/ha)",
      ],
    ];

    metricas.forEach((m) => {
      const startDate = new Date(m.periodo_inicio);
      const endDate = new Date(m.periodo_fim);
      const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      csvData.push([
        m.periodo_fim,
        String(periodDays),
        String(m.ndvi_mean ?? "N/A"),
        String(m.evi_mean ?? "N/A"),
        String(m.ndwi_mean ?? "N/A"),
        String(m.ndmi_mean ?? "N/A"),
        String(m.gndvi_mean ?? "N/A"),
        String(m.ndre_mean ?? "N/A"),
        String(m.rendvi_mean ?? "N/A"),
        String(m.biomassa ?? "N/A"),
      ]);
    });

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `historico_${area.nome_area}_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Histórico exportado",
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

  if (!area) {
    return (
      <Layout>
        <div className="p-8">
          <p className="text-center text-muted-foreground">Área não encontrada</p>
        </div>
      </Layout>
    );
  }

  const chartData = prepareChartData();
  const ndviTrend = calculateTrend("ndvi_mean");
  const eviTrend = calculateTrend("evi_mean");
  const biomassaTrend = calculateTrend("biomassa");

  return (
    <Layout>
      <div className="p-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/areas")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Áreas
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Histórico Temporal
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
              onClick={exportHistoryToCSV}
              disabled={metricas.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {metricas.length === 0 ? (
          <Card className="border-border p-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">Nenhum dado histórico disponível</p>
              <p className="text-sm">Esta área ainda não possui métricas calculadas ao longo do tempo</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Cards de Tendências */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-border p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">NDVI Atual</p>
                    <p className="text-3xl font-bold">
                      {ndviTrend.value?.toFixed(3) || "N/A"}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${ndviTrend.trend === "up" ? "bg-green-100 dark:bg-green-900" : ndviTrend.trend === "down" ? "bg-red-100 dark:bg-red-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                    {getTrendIcon(ndviTrend.trend)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(ndviTrend.trend)}`}>
                    {ndviTrend.trend === "up" ? "+" : ndviTrend.trend === "down" ? "-" : ""}
                    {ndviTrend.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </Card>

              <Card className="border-border p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">EVI Atual</p>
                    <p className="text-3xl font-bold">
                      {eviTrend.value?.toFixed(3) || "N/A"}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${eviTrend.trend === "up" ? "bg-green-100 dark:bg-green-900" : eviTrend.trend === "down" ? "bg-red-100 dark:bg-red-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                    {getTrendIcon(eviTrend.trend)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(eviTrend.trend)}`}>
                    {eviTrend.trend === "up" ? "+" : eviTrend.trend === "down" ? "-" : ""}
                    {eviTrend.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </Card>

              <Card className="border-border p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Biomassa Atual</p>
                    <p className="text-3xl font-bold">
                      {biomassaTrend.value?.toFixed(1) || "N/A"}
                      {biomassaTrend.value && <span className="text-lg text-muted-foreground ml-1">t/ha</span>}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${biomassaTrend.trend === "up" ? "bg-green-100 dark:bg-green-900" : biomassaTrend.trend === "down" ? "bg-red-100 dark:bg-red-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                    {getTrendIcon(biomassaTrend.trend)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(biomassaTrend.trend)}`}>
                    {biomassaTrend.trend === "up" ? "+" : biomassaTrend.trend === "down" ? "-" : ""}
                    {biomassaTrend.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs período anterior</span>
                </div>
              </Card>
            </div>

            {/* Informações do Histórico */}
            <Card className="border-border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total de Medições</p>
                  <p className="text-2xl font-bold">{metricas.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Primeira Medição</p>
                  <p className="text-lg font-semibold">
                    {format(parseISO(metricas[0].periodo_fim), "MMM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Última Medição</p>
                  <p className="text-lg font-semibold">
                    {format(parseISO(metricas[metricas.length - 1].periodo_fim), "MMM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">NDVI Médio</p>
                  <p className="text-lg font-semibold">
                    {(metricas.reduce((sum, m) => sum + (m.ndvi_mean || 0), 0) / metricas.length).toFixed(3)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Gráficos */}
            <Card className="border-border p-6">
              <h2 className="text-xl font-bold mb-6">Evolução das Métricas</h2>

              <Tabs defaultValue="vegetation" className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                  <TabsTrigger value="vegetation">Vegetação</TabsTrigger>
                  <TabsTrigger value="water">Água/Umidade</TabsTrigger>
                  <TabsTrigger value="advanced">Avançados</TabsTrigger>
                  <TabsTrigger value="biomass">Biomassa</TabsTrigger>
                </TabsList>

                {/* Tab: Índices de Vegetação */}
                <TabsContent value="vegetation" className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip 
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.date === label);
                          return item?.fullDate || label;
                        }}
                        formatter={(value: number) => value.toFixed(4)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ndvi"
                        stroke="hsl(160, 85%, 40%)"
                        strokeWidth={2}
                        name="NDVI"
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="evi"
                        stroke="hsl(220, 85%, 50%)"
                        strokeWidth={2}
                        name="EVI"
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="gndvi"
                        stroke="hsl(120, 85%, 40%)"
                        strokeWidth={2}
                        name="GNDVI"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                {/* Tab: Água e Umidade */}
                <TabsContent value="water" className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis fontSize={12} domain={[-1, 1]} />
                      <Tooltip 
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.date === label);
                          return item?.fullDate || label;
                        }}
                        formatter={(value: number) => value.toFixed(4)}
                      />
                      <Legend />
                      <RechartsArea
                        type="monotone"
                        dataKey="ndwi"
                        stroke="hsl(200, 85%, 50%)"
                        fill="hsl(200, 85%, 50%)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="NDWI (Água)"
                      />
                      <RechartsArea
                        type="monotone"
                        dataKey="ndmi"
                        stroke="hsl(180, 85%, 40%)"
                        fill="hsl(180, 85%, 40%)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="NDMI (Umidade)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>

                {/* Tab: Índices Avançados */}
                <TabsContent value="advanced" className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.date === label);
                          return item?.fullDate || label;
                        }}
                        formatter={(value: number) => value?.toFixed(4) || "N/A"}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ndre"
                        stroke="hsl(280, 85%, 50%)"
                        strokeWidth={2}
                        name="NDRE (Red Edge)"
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rendvi"
                        stroke="hsl(320, 85%, 50%)"
                        strokeWidth={2}
                        name="RENDVI"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                {/* Tab: Biomassa */}
                <TabsContent value="biomass" className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip 
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.date === label);
                          return item?.fullDate || label;
                        }}
                        formatter={(value: number) => `${value?.toFixed(2) || "N/A"} t/ha`}
                      />
                      <Legend />
                      <RechartsArea
                        type="monotone"
                        dataKey="biomassa"
                        stroke="hsl(40, 85%, 50%)"
                        fill="hsl(40, 85%, 50%)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Biomassa (t/ha)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HistoricoArea;
