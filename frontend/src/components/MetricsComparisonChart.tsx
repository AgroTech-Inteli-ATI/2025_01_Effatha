/**
 * Gráfico de comparação de métricas entre múltiplas áreas
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metricas } from "@/types/metricas";
import type { Area } from "@/types/area";

interface MetricsComparisonChartProps {
  metricas: Metricas[];
  areas: Area[];
}

const COLORS = [
  "hsl(160, 85%, 40%)", // Verde
  "hsl(220, 85%, 50%)", // Azul
  "hsl(40, 85%, 50%)",  // Amarelo
  "hsl(280, 85%, 50%)", // Roxo
  "hsl(10, 85%, 50%)",  // Vermelho
];

export function MetricsComparisonChart({
  metricas,
  areas,
}: MetricsComparisonChartProps) {
  // Preparar dados para gráfico de barras
  const barChartData = [
    {
      name: "NDVI",
      ...metricas.reduce((acc, m, idx) => {
        const area = areas.find(a => a.id === m.area_id);
        acc[area?.nome_area || `Área ${idx + 1}`] = m.ndvi_mean || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: "EVI",
      ...metricas.reduce((acc, m, idx) => {
        const area = areas.find(a => a.id === m.area_id);
        acc[area?.nome_area || `Área ${idx + 1}`] = m.evi_mean || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: "NDWI",
      ...metricas.reduce((acc, m, idx) => {
        const area = areas.find(a => a.id === m.area_id);
        acc[area?.nome_area || `Área ${idx + 1}`] = m.ndwi_mean || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: "NDMI",
      ...metricas.reduce((acc, m, idx) => {
        const area = areas.find(a => a.id === m.area_id);
        acc[area?.nome_area || `Área ${idx + 1}`] = m.ndmi_mean || 0;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      name: "GNDVI",
      ...metricas.reduce((acc, m, idx) => {
        const area = areas.find(a => a.id === m.area_id);
        acc[area?.nome_area || `Área ${idx + 1}`] = m.gndvi_mean || 0;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  // Preparar dados para gráfico radar
  const radarChartData = metricas.map((m, idx) => {
    const area = areas.find(a => a.id === m.area_id);
    return {
      area: area?.nome_area || `Área ${idx + 1}`,
      NDVI: (m.ndvi_mean || 0) * 100,
      EVI: (m.evi_mean || 0) * 100,
      NDWI: ((m.ndwi_mean || 0) + 1) * 50, // Normalizar de [-1,1] para [0,100]
      NDMI: ((m.ndmi_mean || 0) + 1) * 50,
      GNDVI: (m.gndvi_mean || 0) * 100,
    };
  });

  const areaNames = areas.map(a => a.nome_area);

  return (
    <Card className="border-border p-6">
      <h3 className="text-xl font-bold mb-6">Comparação de Índices de Vegetação</h3>
      
      <Tabs defaultValue="bars" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="bars">Gráfico de Barras</TabsTrigger>
          <TabsTrigger value="radar">Gráfico Radar</TabsTrigger>
        </TabsList>

        <TabsContent value="bars" className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} domain={[-0.2, 1]} />
              <Tooltip />
              <Legend />
              {areaNames.map((name, idx) => (
                <Bar
                  key={name}
                  dataKey={name}
                  fill={COLORS[idx % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="radar" className="mt-6">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarChartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" fontSize={12} />
              <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
              <Tooltip />
              <Legend />
              <Radar
                name="NDVI"
                dataKey="NDVI"
                stroke={COLORS[0]}
                fill={COLORS[0]}
                fillOpacity={0.2}
              />
              <Radar
                name="EVI"
                dataKey="EVI"
                stroke={COLORS[1]}
                fill={COLORS[1]}
                fillOpacity={0.2}
              />
              <Radar
                name="GNDVI"
                dataKey="GNDVI"
                stroke={COLORS[2]}
                fill={COLORS[2]}
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Valores normalizados para escala 0-100 para melhor visualização
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
