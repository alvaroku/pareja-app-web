export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  parejaId?: number;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}
