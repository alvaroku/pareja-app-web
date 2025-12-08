export interface Meta {
  id: number;
  titulo: string;
  descripcion: string;
  fechaObjetivo: Date;
  completada: boolean;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMetaDto {
  titulo: string;
  descripcion: string;
  fechaObjetivo: string;
  usuarioId: number;
}

export interface UpdateMetaDto {
  id: number;
  titulo: string;
  descripcion: string;
  fechaObjetivo: string;
  completada: boolean;
}
