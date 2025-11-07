/**
 * Componente para exibir métricas em cards
 */

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import type { Metricas } from "@/types/metricas";

interface MetricsCardsProps {
  metricas: Metricas;
}

export function MetricsCards({ metricas }: MetricsCardsProps) {
  const formatValue = (value: number | null, decimals: number = 2): string => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(decimals);
  };

  const getHealthStatus = (ndvi: number | null): { color: string; label: string; icon: LucideIcon } => {
    if (ndvi === null) return { color: "text-gray-500", label: "N/A", icon: Minus };
    if (ndvi >= 0.6) return { color: "text-green-600", label: "Excelente", icon: TrendingUp };
    if (ndvi >= 0.4) return { color: "text-yellow-600", label: "Moderado", icon: Minus };
    return { color: "text-red-600", label: "Baixo", icon: TrendingDown };
  };

  const health = getHealthStatus(metricas.ndvi_mean);
  const HealthIcon = health.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* NDVI */}
      <Card className="p-4 border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">NDVI</p>
            <p className="text-2xl font-bold">{formatValue(metricas.ndvi_mean)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Mediana: {formatValue(metricas.ndvi_median)}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${health.color} bg-opacity-10`}>
            <HealthIcon className={`h-5 w-5 ${health.color}`} />
          </div>
        </div>
        <div className="mt-2">
          <span className={`text-xs font-medium ${health.color}`}>{health.label}</span>
        </div>
      </Card>

      {/* EVI */}
      <Card className="p-4 border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">EVI</p>
            <p className="text-2xl font-bold">{formatValue(metricas.evi_mean)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Mediana: {formatValue(metricas.evi_median)}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-muted-foreground">Enhanced Vegetation Index</span>
        </div>
      </Card>

      {/* NDWI */}
      <Card className="p-4 border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">NDWI</p>
            <p className="text-2xl font-bold">{formatValue(metricas.ndwi_mean)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Mediana: {formatValue(metricas.ndwi_median)}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900">
            <TrendingUp className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-muted-foreground">Índice de Água</span>
        </div>
      </Card>

      {/* Biomassa */}
      <Card className="p-4 border-border">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Biomassa</p>
            <p className="text-2xl font-bold">
              {metricas.biomassa ? `${formatValue(metricas.biomassa, 1)}` : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {metricas.biomassa ? "t/ha" : "Não calculado"}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xs text-muted-foreground">Estimativa</span>
        </div>
      </Card>

      {/* NDMI */}
      <Card className="p-4 border-border">
        <div>
          <p className="text-sm text-muted-foreground mb-1">NDMI</p>
          <p className="text-xl font-bold">{formatValue(metricas.ndmi_mean)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Umidade • Mediana: {formatValue(metricas.ndmi_median)}
          </p>
        </div>
      </Card>

      {/* GNDVI */}
      <Card className="p-4 border-border">
        <div>
          <p className="text-sm text-muted-foreground mb-1">GNDVI</p>
          <p className="text-xl font-bold">{formatValue(metricas.gndvi_mean)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Vegetação Verde • Mediana: {formatValue(metricas.gndvi_median)}
          </p>
        </div>
      </Card>

      {/* NDRE */}
      <Card className="p-4 border-border">
        <div>
          <p className="text-sm text-muted-foreground mb-1">NDRE</p>
          <p className="text-xl font-bold">{formatValue(metricas.ndre_mean)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Red Edge • Mediana: {formatValue(metricas.ndre_median)}
          </p>
        </div>
      </Card>

      {/* RENDVI */}
      <Card className="p-4 border-border">
        <div>
          <p className="text-sm text-muted-foreground mb-1">RENDVI</p>
          <p className="text-xl font-bold">{formatValue(metricas.rendvi_mean)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Red Edge NDVI • Mediana: {formatValue(metricas.rendvi_median)}
          </p>
        </div>
      </Card>
    </div>
  );
}
