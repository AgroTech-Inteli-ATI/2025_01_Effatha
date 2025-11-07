/**
 * Tipos relacionados a Métricas
 */

export interface Metricas {
  id: number;
  area_id: number;
  periodo_inicio: string; // Date ISO string
  periodo_fim: string; // Date ISO string
  
  // NDVI
  ndvi_mean: number | null;
  ndvi_median: number | null;
  ndvi_std: number | null;
  
  // EVI
  evi_mean: number | null;
  evi_median: number | null;
  evi_std: number | null;
  
  // NDWI
  ndwi_mean: number | null;
  ndwi_median: number | null;
  ndwi_std: number | null;
  
  // NDMI
  ndmi_mean: number | null;
  ndmi_median: number | null;
  ndmi_std: number | null;
  
  // GNDVI
  gndvi_mean: number | null;
  gndvi_median: number | null;
  gndvi_std: number | null;
  
  // NDRE
  ndre_mean: number | null;
  ndre_median: number | null;
  ndre_std: number | null;
  
  // RENDVI
  rendvi_mean: number | null;
  rendvi_median: number | null;
  rendvi_std: number | null;
  
  // Outros
  biomassa: number | null;
  cobertura_vegetal: number | null;
}

export interface CreateMetricasDTO {
  area_id: number;
  periodo_inicio: string;
  periodo_fim: string;
  ndvi_mean?: number;
  ndvi_median?: number;
  ndvi_std?: number;
  evi_mean?: number;
  evi_median?: number;
  evi_std?: number;
  ndwi_mean?: number;
  ndwi_median?: number;
  ndwi_std?: number;
  ndmi_mean?: number;
  ndmi_median?: number;
  ndmi_std?: number;
  gndvi_mean?: number;
  gndvi_median?: number;
  gndvi_std?: number;
  ndre_mean?: number;
  ndre_median?: number;
  ndre_std?: number;
  rendvi_mean?: number;
  rendvi_median?: number;
  rendvi_std?: number;
  biomassa?: number;
  cobertura_vegetal?: number;
}

// Tipos para integração com Google Earth Engine
export interface ComputeMetricsRequest {
  geometry?: {
    type: string;
    coordinates: number[][][];
  };
  kml?: string;
  start_date: string;
  end_date: string;
  collection?: string;
  max_biomass?: number;
  timeseries?: boolean;
  timeseries_unit?: 'per_image' | 'period';
  timeseries_period_days?: number;
  max_images?: number;
}

export interface ComputeMetricsResponse {
  image_count?: number;
  requested_period?: {
    start: string;
    end: string;
  };
  metrics?: {
    NDVI_mean?: number;
    NDVI_median?: number;
    NDVI_stdDev?: number;
    EVI_mean?: number;
    EVI_median?: number;
    EVI_stdDev?: number;
    NDWI_mean?: number;
    NDWI_median?: number;
    NDWI_stdDev?: number;
    NDMI_mean?: number;
    NDMI_median?: number;
    NDMI_stdDev?: number;
    GNDVI_mean?: number;
    GNDVI_median?: number;
    GNDVI_stdDev?: number;
    NDRE_mean?: number;
    NDRE_median?: number;
    NDRE_stdDev?: number;
    RENDVI_mean?: number;
    RENDVI_median?: number;
    RENDVI_stdDev?: number;
    BIOMASSA_PROXY_mean?: number;
    BIOMASSA_PROXY_median?: number;
    BIOMASSA_PROXY_stdDev?: number;
  };
  BIOMASSA_EST_mean?: number;
  // Timeseries
  timeseries_mode?: string;
  count_available?: number;
  returned_count?: number;
  note?: string;
  series?: TimeseriesEntry[];
}

export interface TimeseriesEntry {
  date?: string;
  period_start?: string;
  period_end?: string;
  count?: number;
  metrics?: Record<string, number | null>;
}
