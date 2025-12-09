export enum EstadoInvitacion {
  Pendiente = 0,
  Aceptada = 1,
  Rechazada = 2
}

export interface Pareja {
  id: number;
  usuarioEnviaId: number;
  usuarioRecibeId: number;
  usuarioEnviaNombre: string;
  usuarioRecibeNombre: string;
  usuarioEnviaEmail: string;
  usuarioRecibeEmail: string;
  estado: EstadoInvitacion;
  createdAt: string;
}

export interface EnviarInvitacionDto {
  emailPareja: string;
}

export interface ResponderInvitacionDto {
  parejaId: number;
  estado: EstadoInvitacion;
}
