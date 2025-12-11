export interface Cita {
  id: number;
  titulo: string;
  descripcion: string;
  fechaHora: Date;
  lugar?: string;
  minutosAntesNotificar: number;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCitaDto {
  titulo: string;
  descripcion: string;
  fechaHora: string;
  lugar: string;
  minutosAntesNotificar: number;
  usuarioId: number;
}

export interface UpdateCitaDto {
  id: number;
  titulo: string;
  descripcion: string;
  fechaHora: Date;
  lugar: string;
  minutosAntesNotificar: number;
}
