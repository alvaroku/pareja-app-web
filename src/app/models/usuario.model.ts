export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  codigoPais?: string;
  telefono?: string;
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
  token: string;
}
