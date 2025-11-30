// src/pages/RelatorioDetalhes.tsx
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type MetricPoint = { date: string; value: number | null };
type Timeseries = {
  ndvi?: MetricPoint[];
  evi?: MetricPoint[];
  ndwi?: MetricPoint[];
  ndmi?: MetricPoint[];
  gndvi?: MetricPoint[];
  ndre?: MetricPoint[];
  rendvi?: MetricPoint[];
  biomassa?: MetricPoint[];
  cobertura_vegetal?: MetricPoint[];
  [k: string]: MetricPoint[] | undefined;
};

type SoilSeries = {
  [k: string]: MetricPoint[] | undefined;
};

const parseDate = (s: string | null | undefined) => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const formatLabel = (iso: string) => {
  const d = parseDate(iso);
  if (!d) return iso;
  return d.toLocaleDateString();
};

const takeLastDays = (series: MetricPoint[] | undefined, days: number) => {
  if (!series) return [];
  if (days <= 0) return series;
  const points = series.slice().sort((a, b) => (parseDate(a.date)?.getTime() ?? 0) - (parseDate(b.date)?.getTime() ?? 0));
  const last = points.length ? parseDate(points[points.length - 1].date) : null;
  if (!last) return points;
  const cutoff = new Date(last);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  return points.filter((p) => {
    const d = parseDate(p.date);
    return d ? d.getTime() >= cutoff.getTime() : true;
  });
};

const toChartData = (series: MetricPoint[] | undefined, days: number) => {
  const pts = takeLastDays(series, days);
  return pts.map((p) => ({ name: formatLabel(p.date), value: p.value }));
};

const SOIL_KEY_LABELS: { [k: string]: string } = {
  clay_0_5_mean: "Argila 0-5 cm",
  clay_5_15_mean: "Argila 5-15 cm",
  clay_15_30_mean: "Argila 15-30 cm",
  clay_30_60_mean: "Argila 30-60 cm",
  clay_60_100_mean: "Argila 60-100 cm",
  clay_100_200_mean: "Argila 100-200 cm",
};

const RelatorioDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [relatorio, setRelatorio] = useState<any | null>(null);
  const [timeseries, setTimeseries] = useState<Timeseries>({});
  const [soilSeries, setSoilSeries] = useState<SoilSeries>({});
  const [loading, setLoading] = useState(true);
  const [loadingSoil, setLoadingSoil] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<string>("30"); // dias mostrados por gráfico

  useEffect(() => {
    if (!id) return;
    const fetchRelatorioAndMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch relatorio
        const rr = await fetch(`${API_BASE}/api/relatorios/${id}`);
        if (!rr.ok) {
          const t = await rr.text().catch(() => "");
          throw new Error(`Falha ao buscar relatório: ${rr.status} ${t}`);
        }
        const rel = await rr.json();
        const relObj = rel.relatorio ?? rel;
        setRelatorio(relObj);

        // maybe results
        const maybeResults = relObj.results ?? relObj.summary ?? null;
        const expectedKeys = ["ndvi", "evi", "ndwi", "ndmi", "gndvi", "ndre", "rendvi", "biomassa", "cobertura_vegetal"];
        const hasTimeseries = maybeResults && expectedKeys.some((k) => Array.isArray(maybeResults[k]));

        if (hasTimeseries) {
          const normalized: Timeseries = {};
          for (const k of expectedKeys) {
            if (Array.isArray(maybeResults[k])) {
              normalized[k] = (maybeResults[k] as any[]).map((p) => ({
                date: p.date ?? p.start ?? p.periodo_inicio ?? p.periodo ?? p.name ?? "",
                value: p.value == null ? null : Number(p.value),
              }));
            }
          }
          setTimeseries((t) => ({ ...t, ...normalized }));
        } else {
          // fallback: fetch all metricas
          const all = await fetch(`${API_BASE}/api/metricas/`);
          if (!all.ok) {
            const t = await all.text().catch(() => "");
            throw new Error(`Falha ao buscar métricas: ${all.status} ${t}`);
          }
          const metricasList = await all.json();
          const areaId = Number(relObj.area_id);
          const startStr = relObj.periodo_inicio;
          const endStr = relObj.periodo_fim;
          const startDate = startStr ? parseDate(startStr) : null;
          const endDate = endStr ? parseDate(endStr) : null;

          const filtered = (metricasList || []).filter((m: any) => {
            const mArea = Number(m.area_id);
            if (mArea !== areaId) return false;
            const mStart = parseDate(m.periodo_inicio);
            const mEnd = parseDate(m.periodo_fim);
            if (!mStart || !mEnd) return false;
            if (startDate && mStart.getTime() < startDate.getTime()) return false;
            if (endDate && mEnd.getTime() > endDate.getTime()) return false;
            return true;
          });

          filtered.sort((a: any, b: any) => {
            const ad = parseDate(a.periodo_inicio)?.getTime() ?? 0;
            const bd = parseDate(b.periodo_inicio)?.getTime() ?? 0;
            return ad - bd;
          });

          const out: Timeseries = {};
          for (const m of filtered) {
            const ts = m.periodo_inicio;
            const pushVal = (key: string, val: any) => {
              if (!out[key]) out[key] = [];
              out[key]!.push({ date: ts, value: val == null ? null : Number(val) });
            };
            pushVal("ndvi", m.ndvi_mean);
            pushVal("evi", m.evi_mean);
            pushVal("ndwi", m.ndwi_mean);
            pushVal("ndmi", m.ndmi_mean);
            pushVal("gndvi", m.gndvi_mean);
            pushVal("ndre", m.ndre_mean);
            pushVal("rendvi", m.rendvi_mean);
            pushVal("biomassa", m.biomassa);
            pushVal("cobertura_vegetal", m.cobertura_vegetal);
          }
          setTimeseries(out);
        }

        // fetch soil metrics
        setLoadingSoil(true);
        try {
          const ss = await fetch(`${API_BASE}/api/metricas_solo/`);
          if (ss.ok) {
            const soilList = await ss.json();
            const areaId = Number(relObj.area_id);
            const startDate = relObj.periodo_inicio ? parseDate(relObj.periodo_inicio) : null;
            const endDate = relObj.periodo_fim ? parseDate(relObj.periodo_fim) : null;

            const filteredSoil = (soilList || []).filter((s: any) => {
              const sArea = Number(s.area_id);
              if (sArea !== areaId) return false;
              const sStart = parseDate(s.periodo_inicio);
              const sEnd = parseDate(s.periodo_fim);
              if (!sStart || !sEnd) return false;
              if (startDate && sStart.getTime() < startDate.getTime()) return false;
              if (endDate && sEnd.getTime() > endDate.getTime()) return false;
              return true;
            });

            filteredSoil.sort((a: any, b: any) => {
              const ad = parseDate(a.periodo_inicio)?.getTime() ?? 0;
              const bd = parseDate(b.periodo_inicio)?.getTime() ?? 0;
              return ad - bd;
            });

            const soilOut: SoilSeries = {};
            for (const s of filteredSoil) {
              const ts = s.periodo_inicio;
              for (const key of Object.keys(SOIL_KEY_LABELS)) {
                const val = s[key];
                if (val === undefined) continue;
                if (!soilOut[key]) soilOut[key] = [];
                soilOut[key]!.push({ date: ts, value: val == null ? null : Number(val) });
              }
            }
            setSoilSeries(soilOut);
          } else {
            const t = await ss.text().catch(() => "");
            console.warn("Falha ao buscar metricas_solo:", ss.status, t);
          }
        } catch (err) {
          console.warn("Erro ao buscar metricas_solo:", err);
        } finally {
          setLoadingSoil(false);
        }
      } catch (err: any) {
        console.error(err);
        setError(String(err?.message ?? err));
        setLoading(false);
        setLoadingSoil(false);
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorioAndMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const daysSelected = Number(timeRange);

  // chart data prepared for each metric
  const ndviChart = useMemo(() => toChartData(timeseries.ndvi, daysSelected), [timeseries.ndvi, daysSelected]);
  const eviChart = useMemo(() => toChartData(timeseries.evi, daysSelected), [timeseries.evi, daysSelected]);
  const ndwiChart = useMemo(() => toChartData(timeseries.ndwi, daysSelected), [timeseries.ndwi, daysSelected]);
  const ndmiChart = useMemo(() => toChartData(timeseries.ndmi, daysSelected), [timeseries.ndmi, daysSelected]);
  const gndviChart = useMemo(() => toChartData(timeseries.gndvi, daysSelected), [timeseries.gndvi, daysSelected]);
  const ndreChart = useMemo(() => toChartData(timeseries.ndre, daysSelected), [timeseries.ndre, daysSelected]);
  const rendviChart = useMemo(() => toChartData(timeseries.rendvi, daysSelected), [timeseries.rendvi, daysSelected]);
  const biomassaChart = useMemo(() => toChartData(timeseries.biomassa, daysSelected), [timeseries.biomassa, daysSelected]);
  const coberturaChart = useMemo(() => toChartData(timeseries.cobertura_vegetal, daysSelected), [timeseries.cobertura_vegetal, daysSelected]);

  // soil charts map
  const soilChartDataMap = useMemo(() => {
    const out: { key: string; label: string; data: any[] }[] = [];
    for (const key of Object.keys(SOIL_KEY_LABELS)) {
      const s = soilSeries[key];
      if (!s || s.length === 0) continue;
      out.push({ key, label: SOIL_KEY_LABELS[key], data: toChartData(s, daysSelected) });
    }
    return out;
  }, [soilSeries, daysSelected]);

  // additional individual metrics map
  const individualMetrics = [
    { key: "ndvi", label: "NDVI", data: ndviChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(160, 85%, 20%)" },
    { key: "evi", label: "EVI", data: eviChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(280, 85%, 50%)" },
    { key: "ndwi", label: "NDWI", data: ndwiChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(220,85%,40%)" },
    { key: "ndmi", label: "NDMI", data: ndmiChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(260,85%,40%)" },
    { key: "gndvi", label: "GNDVI", data: gndviChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(120,85%,30%)" },
    { key: "ndre", label: "NDRE", data: ndreChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(200,85%,40%)" },
    { key: "rendvi", label: "RENDVI", data: rendviChart, domain: [0, 1] as [number, number] | undefined, stroke: "hsl(320,85%,45%)" },
    { key: "biomassa", label: "Biomassa (kg/ha)", data: biomassaChart, domain: undefined, stroke: "hsl(40, 85%, 50%)" },
    { key: "cobertura_vegetal", label: "Cobertura Vegetal (%)", data: coberturaChart, domain: [0, 100] as [number, number] | undefined, stroke: "hsl(100,80%,30%)" },
  ];

  // Export report: open new window with printable HTML
  const exportReport = () => {
    const container = document.getElementById("report-printable");
    if (!container) {
      alert("Área de impressão não encontrada.");
      return;
    }
    const win = window.open("", "_blank", "noopener,width=1200,height=900");
    if (!win) {
      alert("Não foi possível abrir nova janela. Permita popups.");
      return;
    }
    const styles = Array.from(document.querySelectorAll("link[rel=stylesheet], style")).map((n) => n.outerHTML).join("\n");
    const html = `
      <html>
        <head>
          <title>Relatório ${id}</title>
          ${styles}
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin: 20px; }
            .report-header { margin-bottom: 16px; }
            .chart { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>Relatório ${id} ${relatorio?.nome ? `— ${relatorio.nome}` : ""}</h1>
            <div>Área: ${relatorio?.area_id ?? "—"}</div>
            <div>Período: ${relatorio?.periodo_inicio ? new Date(relatorio.periodo_inicio).toLocaleDateString() : "—"} → ${relatorio?.periodo_fim ? new Date(relatorio.periodo_fim).toLocaleDateString() : "—"}</div>
            <hr />
          </div>
          <div id="content">
            ${container.innerHTML}
          </div>
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" />
            <span>Carregando relatório...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <Card className="border-border p-6">
            <h2 className="text-lg font-semibold text-destructive">Erro</h2>
            <pre className="text-sm mt-2">{error}</pre>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8" id="report-printable">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-primary">
            Relatório {id} {relatorio?.nome ? `— ${relatorio.nome}` : ""}
          </h1>
          <div className="flex gap-2">
            <Button onClick={exportReport}>Exportar relatório</Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-6">
          Área: {relatorio?.area_id ?? "—"} • Período:{" "}
          {relatorio?.periodo_inicio ? new Date(relatorio.periodo_inicio).toLocaleDateString() : "—"} →{" "}
          {relatorio?.periodo_fim ? new Date(relatorio.periodo_fim).toLocaleDateString() : "—"}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Variáveis (Área)</h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select value={String(daysSelected)} onValueChange={(v) => setTimeRange(v)}>
                    <SelectTrigger className="w-[140px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Últimos 7 dias</SelectItem>
                      <SelectItem value="15">Últimos 15 dias</SelectItem>
                      <SelectItem value="30">Últimos 30 dias</SelectItem>
                      <SelectItem value="60">Últimos 60 dias</SelectItem>
                      <SelectItem value="90">Últimos 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs defaultValue="ndvi" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                  <TabsTrigger value="ndvi" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    NDVI
                  </TabsTrigger>
                  <TabsTrigger value="evi" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    EVI
                  </TabsTrigger>
                  <TabsTrigger value="biomass" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Biomassa
                  </TabsTrigger>
                  <TabsTrigger value="ndwi" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    NDWI
                  </TabsTrigger>
                  <TabsTrigger value="ndmi" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    NDMI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ndvi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">NDVI - Índice de Vegetação</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={ndviChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(160, 85%, 20%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="evi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">EVI - Índice de Vegetação Melhorado</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={eviChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(280, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="biomass" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">Biomassa Estimada (kg/ha)</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={biomassaChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(40, 85%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="ndwi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">NDWI - Índice de Água</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={ndwiChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(220,85%,40%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="ndmi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">NDMI - Índice de Umidade</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={ndmiChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(260,85%,40%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Comparativo / resumo */}
          <Card className="border-border">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Resumo / Comparativo</h3>
              <div className="text-sm text-muted-foreground mb-4">
                Use os gráficos para analisar tendências. Se você quiser comparar outra área, crie um relatório comparativo.
              </div>

              <Tabs defaultValue="ndre" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b rounded-none pb-0">
                  <TabsTrigger value="ndre" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    NDRE
                  </TabsTrigger>
                  <TabsTrigger value="gndvi" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    GNDVI
                  </TabsTrigger>
                  <TabsTrigger value="rendvi" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    RENDVI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ndre" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">NDRE</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={ndreChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(200,85%,40%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="gndvi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">GNDVI</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={gndviChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(120,85%,30%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="rendvi" className="mt-4">
                  <div className="text-xs text-muted-foreground mb-2">RENDVI</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={rendviChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(320,85%,45%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Solo */}
        <Card className="border-border mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Métricas de solo</h3>
              {loadingSoil ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="animate-spin h-4 w-4" /> Carregando solo...
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">{Object.keys(soilSeries).length} faixa(s) disponível(is)</div>
              )}
            </div>

            {soilChartDataMap.length === 0 && !loadingSoil && (
              <div className="text-sm text-muted-foreground">Nenhuma métrica de solo encontrada para esse relatório.</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soilChartDataMap.map((s) => (
                <div key={s.key} className="border rounded p-3">
                  <div className="text-sm font-medium mb-2">{s.label}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={s.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(30,80%,40%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Gráficos individuais para todas as métricas */}
        <Card className="border-border mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gráficos individuais</h3>
              <div className="text-sm text-muted-foreground">Cada métrica em um card separado</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {individualMetrics.map((m) => (
                <div key={m.key} className="border rounded p-3">
                  <div className="text-sm font-medium mb-2">{m.label}</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={m.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} domain={m.domain} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={m.stroke} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatorioDetalhes;
