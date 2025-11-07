/**
 * Tipos relacionados a Propriedade
 */

export interface Propriedade {
  id: number;
  data_criacao: string;
  responsavel: string;
  nome: string;
}

export interface CreatePropriedadeDTO {
  responsavel: string;
  nome: string;
}

export interface UpdatePropriedadeDTO {
  responsavel?: string;
  nome?: string;
}
