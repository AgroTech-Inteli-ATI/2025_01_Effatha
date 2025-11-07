/**
 * Tipos relacionados a Área
 */

export interface Coordenada {
  lat: number;
  lng: number;
}

export interface Area {
  id: number;
  propriedade_id: number;
  coordenada: Coordenada[][] | null; // Array de polígonos
  municipio: string;
  estado: string;
  nome_area: string;
  cultura_principal: string | null;
  data_criacao: string;
  imagens: string | null;
  observacoes: string | null;
}

export interface CreateAreaDTO {
  propriedade_id: number;
  coordenada: Coordenada[][];
  municipio: string;
  estado: string;
  nome_area: string;
  cultura_principal?: string;
  imagens?: string;
  observacoes?: string;
}

export interface UpdateAreaDTO {
  propriedade_id?: number;
  coordenada?: Coordenada[][];
  municipio?: string;
  estado?: string;
  nome_area?: string;
  cultura_principal?: string;
  imagens?: string;
  observacoes?: string;
}
