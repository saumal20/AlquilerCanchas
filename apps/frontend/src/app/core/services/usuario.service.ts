import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

/**
 * Contrato de perfil de usuario (interfaz + token de inyección).
 * Fase A: implementado por UsuarioServiceFake (sin persistencia real).
 * Fase B: se reemplaza por una implementación HTTP — ver recomendaciones-arquitectura.md §4.
 */
export abstract class UsuarioService {
  abstract obtenerPerfil(): Observable<Usuario>;
  abstract actualizarPerfil(cambios: Partial<Usuario>): Observable<Usuario>;
}
