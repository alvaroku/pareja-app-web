export interface Cita {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  lugar: string;
  usuarioId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCitaDto {
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  usuarioId: number;
}

export interface UpdateCitaDto {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
}
