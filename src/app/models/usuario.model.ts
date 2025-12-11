export enum TipoRecurso {
  Imagen = 0,
  Documento = 1,
  Video = 2,
  Audio = 3
}

export enum UserRole {
  User = 0,
  SuperAdmin = 1
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
  role: UserRole;
  timeZone?: string;
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
  timeZone?: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
  codigoPais?: string;
  telefono?: string;
  resource?: ResourceResponse;
  token: string;
  role: UserRole;
  timeZone?: string;
}
