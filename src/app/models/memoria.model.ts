export enum TipoRecurso {
  Imagen = 0,
  Documento = 1,
  Video = 2,
  Audio = 3
}

export interface ResourceResponse {
  id: number;
  nombre: string;
  extension: string;
  tamaño: number;
  urlPublica: string;
  tipo: TipoRecurso;
}

export interface Memoria {
  id: number;
  titulo: string;
  descripcion: string;
  fechaMemoria: Date;
  usuarioId: number;
  resource?: ResourceResponse;
}

export interface CreateMemoriaDto {
  titulo: string;
  descripcion: string;
  fechaMemoria: string;
  usuarioId: number;
}

export interface UpdateMemoriaDto {
  titulo: string;
  descripcion: string;
  fechaMemoria: string;
}
