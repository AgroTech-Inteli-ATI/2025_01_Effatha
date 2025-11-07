/**
 * Service para gerenciar Propriedades
 */

import { crudApi } from '@/lib/api';
import type { Propriedade, CreatePropriedadeDTO, UpdatePropriedadeDTO } from '@/types/propriedade';

const BASE_PATH = '/api/propriedade';

export const propriedadeService = {
  /**
   * Lista todas as propriedades
   */
  async getAll(): Promise<Propriedade[]> {
    return crudApi.get<Propriedade[]>(BASE_PATH);
  },

  /**
   * Busca uma propriedade por ID
   */
  async getById(id: number): Promise<Propriedade> {
    return crudApi.get<Propriedade>(`${BASE_PATH}/${id}`);
  },

  /**
   * Cria uma nova propriedade
   */
  async create(data: CreatePropriedadeDTO): Promise<Propriedade> {
    return crudApi.post<Propriedade>(BASE_PATH, data);
  },

  /**
   * Atualiza uma propriedade existente
   */
  async update(id: number, data: UpdatePropriedadeDTO): Promise<Propriedade> {
    return crudApi.put<Propriedade>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Deleta uma propriedade
   */
  async delete(id: number): Promise<{ mensagem: string }> {
    return crudApi.delete<{ mensagem: string }>(`${BASE_PATH}/${id}`);
  },

  /**
   * Busca propriedades com filtro (implementação futura no backend)
   */
  async search(query: string): Promise<Propriedade[]> {
    // Por enquanto, filtra no cliente
    const propriedades = await this.getAll();
    if (!query) return propriedades;
    
    const lowerQuery = query.toLowerCase();
    return propriedades.filter(
      (p) =>
        p.nome.toLowerCase().includes(lowerQuery) ||
        p.responsavel.toLowerCase().includes(lowerQuery)
    );
  },
};
