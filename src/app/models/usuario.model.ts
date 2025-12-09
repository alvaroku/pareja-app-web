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

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  codigoPais?: string;
  telefono?: string;
  resource?: ResourceResponse;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  codigoPais?: string;
  telefono?: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  codigoPais?: string;
  telefono?: string;
  resource?: ResourceResponse;
  token: string;
}
