export interface Memoria {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  imagenUrl?: string;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemoriaDto {
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl?: string;
  usuarioId: number;
}

export interface UpdateMemoriaDto {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl?: string;
}
