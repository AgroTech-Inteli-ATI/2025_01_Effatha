/**
 * Dashboard principal do sistema com visão geral e estatísticas
 */

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Leaf,
  Droplets,
  Activity,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { propriedadeService } from "@/services/propriedadeService";
import { areaService } from "@/services/areaService";
import { metricasService } from "@/services/metricasService";
import type { Propriedade } from "@/types/propriedade";
import type { Area } from "@/types/area";
import type { Metricas } from "@/types/metricas";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [metricas, setMetricas] = useState<Metricas[]>([]);

  // Estatísticas calculadas
  const [stats, setStats] = useState({
    totalPropriedades: 0,
    totalAreas: 0,
    totalMetricas: 0,
    areasComAlerta: 0,
    ndviMedio: 0,
    biomassaMedia: 0,
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propData, areasData, metricasData] = await Promise.all([
        propriedadeService.getAll(),
        areaService.getAll(),
        metricasService.getAll(),
      ]);

      setPropriedades(propData);
      setAreas(areasData);
      setMetricas(metricasData);

      // Calcular estatísticas
      const areasComMetricas = areasData.filter(area => 
        metricasData.some(m => m.area_id === area.id)
      );

      const ndviValues = metricasData
        .map(m => m.ndvi_mean)
        .filter((v): v is number => v !== null);
      
      const biomassaValues = metricasData
        .map(m => m.biomassa)
        .filter((v): v is number => v !== null);

      const areasComAlerta = metricasData.filter(m => 
        m.ndvi_mean !== null && m.ndvi_mean < 0.4
      ).length;

      setStats({
        totalPropriedades: propData.length,
        totalAreas: areasData.length,
        totalMetricas: metricasData.length,
        areasComAlerta,
        ndviMedio: ndviValues.length > 0 
          ? ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length 
          : 0,
        biomassaMedia: biomassaValues.length > 0
          ? biomassaValues.reduce((a, b) => a + b, 0) / biomassaValues.length
          : 0,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Métricas mais recentes (últimas 5)
  const recentMetricas = metricas
    .sort((a, b) => new Date(b.periodo_fim).getTime() - new Date(a.periodo_fim).getTime())
    .slice(0, 5);

  // Áreas com NDVI baixo (alerta)
  const areasComAlerta = metricas
    .filter(m => m.ndvi_mean !== null && m.ndvi_mean < 0.4)
    .map(m => {
      const area = areas.find(a => a.id === m.area_id);
      return { metrica: m, area };
    })
    .filter(item => item.area !== undefined)
    .slice(0, 3);

  // Distribuição de NDVI por faixa
  const ndviDistribution = [
    {
      name: "Excelente",
      value: metricas.filter(m => m.ndvi_mean && m.ndvi_mean >= 0.6).length,
      color: "#16a34a",
    },
    {
      name: "Bom",
      value: metricas.filter(m => m.ndvi_mean && m.ndvi_mean >= 0.4 && m.ndvi_mean < 0.6).length,
      color: "#ca8a04",
    },
    {
      name: "Baixo",
      value: metricas.filter(m => m.ndvi_mean && m.ndvi_mean < 0.4).length,
      color: "#dc2626",
    },
  ];

  // Top 5 áreas por NDVI
  const topAreas = metricas
    .filter(m => m.ndvi_mean !== null)
    .sort((a, b) => (b.ndvi_mean || 0) - (a.ndvi_mean || 0))
    .slice(0, 5)
    .map(m => {
      const area = areas.find(a => a.id === m.area_id);
      return {
        name: area?.nome_area || `Área ${m.area_id}`,
        ndvi: m.ndvi_mean || 0,
      };
    });

  const formatDate = (dateStr: string): string => {
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  const getNdviStatus = (ndvi: number | null): { color: string; label: string } => {
    if (ndvi === null) return { color: "text-gray-500", label: "N/A" };
    if (ndvi >= 0.6) return { color: "text-green-600", label: "Excelente" };
    if (ndvi >= 0.4) return { color: "text-yellow-600", label: "Bom" };
    return { color: "text-red-600", label: "Alerta" };
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
          <h1 className="text-4xl font-bold text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Visão geral do sistema de monitoramento agrícola
          </p>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border"
            onClick={() => navigate("/projetos")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Propriedades</p>
                <h3 className="text-3xl font-bold">{stats.totalPropriedades}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <span className="text-sm text-muted-foreground">Ver todas</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border"
            onClick={() => navigate("/areas")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Áreas Cadastradas</p>
                <h3 className="text-3xl font-bold">{stats.totalAreas}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <span className="text-sm text-muted-foreground">Gerenciar áreas</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-border"
            onClick={() => navigate("/relatorios")}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Métricas Calculadas</p>
                <h3 className="text-3xl font-bold">{stats.totalMetricas}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <span className="text-sm text-muted-foreground">Ver relatórios</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card 
            className="p-6 border-border"
            style={{
              background: stats.areasComAlerta > 0 
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)"
                : "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)"
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Áreas com Alerta</p>
                <h3 className="text-3xl font-bold">{stats.areasComAlerta}</h3>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stats.areasComAlerta > 0 
                  ? "bg-red-100 dark:bg-red-900" 
                  : "bg-green-100 dark:bg-green-900"
              }`}>
                <AlertCircle className={`h-6 w-6 ${
                  stats.areasComAlerta > 0 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-green-600 dark:text-green-400"
                }`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.areasComAlerta > 0 
                ? "NDVI abaixo de 0.4"
                : "Todas as áreas saudáveis"}
            </p>
          </Card>
        </div>

        {/* Indicadores de Saúde */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">NDVI Médio Geral</h3>
                <p className="text-sm text-muted-foreground">Índice de vegetação</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{stats.ndviMedio.toFixed(3)}</span>
              <span className={`flex items-center gap-1 mb-2 ${
                stats.ndviMedio >= 0.6 ? "text-green-600" : 
                stats.ndviMedio >= 0.4 ? "text-yellow-600" : "text-red-600"
              }`}>
                {stats.ndviMedio >= 0.5 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {getNdviStatus(stats.ndviMedio).label}
                </span>
              </span>
            </div>
          </Card>

          <Card className="border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold">Biomassa Média</h3>
                <p className="text-sm text-muted-foreground">Estimativa geral</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">
                {stats.biomassaMedia > 0 ? stats.biomassaMedia.toFixed(1) : "N/A"}
              </span>
              {stats.biomassaMedia > 0 && (
                <span className="text-sm text-muted-foreground mb-2">t/ha</span>
              )}
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribuição de NDVI */}
          <Card className="border-border p-6">
            <h3 className="text-xl font-bold mb-4">Distribuição de Saúde das Áreas</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ndviDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]}>
                  {ndviDistribution.map((entry, index) => (
                    <Bar key={index} dataKey="value" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm text-muted-foreground">Excelente (≥0.6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                <span className="text-sm text-muted-foreground">Bom (0.4-0.6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-sm text-muted-foreground">Alerta (&lt;0.4)</span>
              </div>
            </div>
          </Card>

          {/* Top 5 Áreas */}
          <Card className="border-border p-6">
            <h3 className="text-xl font-bold mb-4">Top 5 Áreas por NDVI</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topAreas} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 1]} fontSize={12} />
                <YAxis type="category" dataKey="name" fontSize={10} width={100} />
                <Tooltip />
                <Bar dataKey="ndvi" fill="hsl(160, 85%, 40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Alertas e Métricas Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Áreas com Alerta */}
          {areasComAlerta.length > 0 && (
            <Card className="border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-bold">Áreas Requerendo Atenção</h3>
              </div>
              <div className="space-y-3">
                {areasComAlerta.map(({ metrica, area }) => {
                  if (!area) return null;
                  return (
                    <div
                      key={metrica.id}
                      className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{area.nome_area}</h4>
                        <Badge variant="destructive" className="text-xs">
                          Alerta
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {area.municipio}/{area.estado}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          NDVI: <span className="font-bold text-red-600">
                            {metrica.ndvi_mean?.toFixed(3)}
                          </span>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/relatorio/${metrica.id}`)}
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Métricas Recentes */}
          <Card className="border-border p-6">
            <h3 className="text-xl font-bold mb-4">Métricas Calculadas Recentemente</h3>
            <div className="space-y-3">
              {recentMetricas.length > 0 ? (
                recentMetricas.map(metrica => {
                  const area = areas.find(a => a.id === metrica.area_id);
                  const status = getNdviStatus(metrica.ndvi_mean);
                  
                  return (
                    <div
                      key={metrica.id}
                      className="p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => navigate(`/relatorio/${metrica.id}`)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">
                          {area?.nome_area || `Área ${metrica.area_id}`}
                        </h4>
                        <Badge className={`${
                          status.color.replace('text-', 'bg-').replace('600', '100')
                        } ${status.color} border-0 text-xs`}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatDate(metrica.periodo_fim)}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>NDVI: <span className="font-bold">
                          {metrica.ndvi_mean?.toFixed(3) || "N/A"}
                        </span></span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma métrica calculada ainda
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
