/**
 * Service para gerenciar Áreas
 */

import { crudApi } from '@/lib/api';
import type { Area, CreateAreaDTO, UpdateAreaDTO } from '@/types/area';

const BASE_PATH = '/api/area';

export const areaService = {
  /**
   * Lista todas as áreas
   */
  async getAll(): Promise<Area[]> {
    return crudApi.get<Area[]>(BASE_PATH);
  },

  /**
   * Lista áreas de uma propriedade específica
   */
  async getByPropriedade(propriedadeId: number): Promise<Area[]> {
    const areas = await this.getAll();
    return areas.filter(area => area.propriedade_id === propriedadeId);
  },

  /**
   * Busca uma área por ID
   */
  async getById(id: number): Promise<Area> {
    return crudApi.get<Area>(`${BASE_PATH}/${id}`);
  },

  /**
   * Cria uma nova área
   */
  async create(data: CreateAreaDTO): Promise<Area> {
    return crudApi.post<Area>(BASE_PATH, data);
  },

  /**
   * Atualiza uma área existente
   */
  async update(id: number, data: UpdateAreaDTO): Promise<Area> {
    return crudApi.put<Area>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Deleta uma área
   */
  async delete(id: number): Promise<{ mensagem: string }> {
    return crudApi.delete<{ mensagem: string }>(`${BASE_PATH}/${id}`);
  },

  /**
   * Busca áreas com filtro
   */
  async search(query: string): Promise<Area[]> {
    const areas = await this.getAll();
    if (!query) return areas;
    
    const lowerQuery = query.toLowerCase();
    return areas.filter(
      (a) =>
        a.nome_area.toLowerCase().includes(lowerQuery) ||
        a.municipio.toLowerCase().includes(lowerQuery) ||
        a.estado.toLowerCase().includes(lowerQuery) ||
        (a.cultura_principal && a.cultura_principal.toLowerCase().includes(lowerQuery))
    );
  },
};
