import { Observable } from 'rxjs';
import { CambioClave, CredencialesLogin, RegistroUsuario, Usuario } from '../models/usuario.model';

/**
 * Contrato de autenticación (interfaz + token de inyección).
 * Fase A: implementado por AuthServiceFake (sin backend real).
 * Fase B: se reemplaza por una implementación HTTP sin tocar los componentes
 * que inyectan AuthService — ver recomendaciones-arquitectura.md §4.
 *
 * El cambio de contraseña vive acá (no en UsuarioService) porque en Fase B
 * es un endpoint de seguridad distinto (revalida credenciales), no un campo
 * más del perfil — separación de responsabilidades intencional.
 */
export abstract class AuthService {
  abstract login(credenciales: CredencialesLogin): Observable<Usuario>;
  abstract registrar(datos: RegistroUsuario): Observable<Usuario>;
  abstract cambiarClave(cambio: CambioClave): Observable<void>;
}
