export interface Meta {
  id: number;
  titulo: string;
  descripcion?: string;
  progreso: number;
  estado: number;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMetaDto {
  titulo: string;
  descripcion?: string;
  usuarioId: number;
}

export interface UpdateMetaDto {
  id: number;
  titulo: string;
  descripcion?: string;
  progreso: number;
  estado: number;
}

export enum EstadoMeta {
  Pendiente = 0,
  EnProgreso = 1,
  Completado = 2
}

export function getEstadoMetaNombre(estado: number): string {
  switch (estado) {
    case EstadoMeta.Pendiente:
      return 'Pendiente';
    case EstadoMeta.EnProgreso:
      return 'En Progreso';
    case EstadoMeta.Completado:
      return 'Completado';
    default:
      return 'Desconocido';
  }
}
