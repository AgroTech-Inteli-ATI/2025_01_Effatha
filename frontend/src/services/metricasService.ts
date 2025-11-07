/**
 * Service para gerenciar Métricas
 */

import { crudApi, metricsApi } from '@/lib/api';
import type { 
  Metricas, 
  CreateMetricasDTO,
  ComputeMetricsRequest,
  ComputeMetricsResponse
} from '@/types/metricas';

const BASE_PATH = '/api/metricas';

export const metricasService = {
  /**
   * Lista todas as métricas
   */
  async getAll(): Promise<Metricas[]> {
    return crudApi.get<Metricas[]>(BASE_PATH);
  },

  /**
   * Lista métricas de uma área específica
   */
  async getByArea(areaId: number): Promise<Metricas[]> {
    const metricas = await this.getAll();
    return metricas.filter(m => m.area_id === areaId);
  },

  /**
   * Busca uma métrica por ID
   */
  async getById(id: number): Promise<Metricas> {
    return crudApi.get<Metricas>(`${BASE_PATH}/${id}`);
  },

  /**
   * Cria uma nova métrica
   */
  async create(data: CreateMetricasDTO): Promise<Metricas> {
    return crudApi.post<Metricas>(BASE_PATH, data);
  },

  /**
   * Atualiza uma métrica existente
   */
  async update(id: number, data: Partial<CreateMetricasDTO>): Promise<Metricas> {
    return crudApi.put<Metricas>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Deleta uma métrica
   */
  async delete(id: number): Promise<{ mensagem: string }> {
    return crudApi.delete<{ mensagem: string }>(`${BASE_PATH}/${id}`);
  },

  /**
   * Calcula métricas usando Google Earth Engine
   */
  async computeMetrics(request: ComputeMetricsRequest): Promise<ComputeMetricsResponse> {
    return metricsApi.post<ComputeMetricsResponse>('/compute', request);
  },

  /**
   * Helper: Converte coordenadas da área para formato GeoJSON
   */
  convertToGeoJSON(coordenadas: { lat: number; lng: number }[][]): { type: string; coordinates: number[][][] } {
    // Converter de {lat, lng} para [lng, lat] (GeoJSON)
    const coordinates = coordenadas.map(polygon => 
      polygon.map(point => [point.lng, point.lat])
    );

    return {
      type: 'Polygon',
      coordinates: coordinates
    };
  },

  /**
   * Helper: Mapeia resposta do Earth Engine para DTO de criação
   */
  mapEarthEngineToDTO(
    areaId: number,
    startDate: string,
    endDate: string,
    response: ComputeMetricsResponse
  ): CreateMetricasDTO {
    const metrics = response.metrics || {};
    
    return {
      area_id: areaId,
      periodo_inicio: startDate,
      periodo_fim: endDate,
      ndvi_mean: metrics.NDVI_mean ?? null,
      ndvi_median: metrics.NDVI_median ?? null,
      ndvi_std: metrics.NDVI_stdDev ?? null,
      evi_mean: metrics.EVI_mean ?? null,
      evi_median: metrics.EVI_median ?? null,
      evi_std: metrics.EVI_stdDev ?? null,
      ndwi_mean: metrics.NDWI_mean ?? null,
      ndwi_median: metrics.NDWI_median ?? null,
      ndwi_std: metrics.NDWI_stdDev ?? null,
      ndmi_mean: metrics.NDMI_mean ?? null,
      ndmi_median: metrics.NDMI_median ?? null,
      ndmi_std: metrics.NDMI_stdDev ?? null,
      gndvi_mean: metrics.GNDVI_mean ?? null,
      gndvi_median: metrics.GNDVI_median ?? null,
      gndvi_std: metrics.GNDVI_stdDev ?? null,
      ndre_mean: metrics.NDRE_mean ?? null,
      ndre_median: metrics.NDRE_median ?? null,
      ndre_std: metrics.NDRE_stdDev ?? null,
      rendvi_mean: metrics.RENDVI_mean ?? null,
      rendvi_median: metrics.RENDVI_median ?? null,
      rendvi_std: metrics.RENDVI_stdDev ?? null,
      biomassa: response.BIOMASSA_EST_mean ?? metrics.BIOMASSA_PROXY_mean ?? null,
      cobertura_vegetal: null, // Calcular baseado em NDVI se necessário
    };
  },
};
