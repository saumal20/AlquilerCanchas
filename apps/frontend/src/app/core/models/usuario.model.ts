export interface Usuario {
  id: string;
  nombreCompleto: string;
  correo: string;
  celular: string;
  dni?: string;
  fotoUrl?: string;
  notificacionesActivas: boolean;
}

export interface CambioClave {
  claveActual: string;
  claveNueva: string;
}

export interface RegistroUsuario {
  nombreCompleto: string;
  correo: string;
  celular: string;
  dni?: string;
  clave: string;
}

export interface CredencialesLogin {
  correo: string;
  clave: string;
}
