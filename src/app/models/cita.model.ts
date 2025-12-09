export interface Cita {
  id: number;
  titulo: string;
  descripcion: string;
  fechaHora: Date;
  lugar?: string;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCitaDto {
  titulo: string;
  descripcion: string;
  fechaHora: string;
  lugar: string;
  usuarioId: number;
}

export interface UpdateCitaDto {
  id: number;
  titulo: string;
  descripcion: string;
  fechaHora: string;
  lugar: string;
}
