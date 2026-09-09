import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, take } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

const USUARIO_DEMO: Usuario = {
  id: 'demo-usuario',
  nombreCompleto: 'Usuario Demo',
  correo: 'demo@canchasapp.com',
  celular: '999999999',
  dni: '',
  fotoUrl: undefined,
  notificacionesActivas: true,
};

/**
 * Implementación falsa para el prototipo de venta (Fase A): guarda los
 * cambios solo en memoria (BehaviorSubject), no hay persistencia real.
 */
@Injectable()
export class UsuarioServiceFake extends UsuarioService {
  private perfil$ = new BehaviorSubject<Usuario>(USUARIO_DEMO);

  obtenerPerfil(): Observable<Usuario> {
    return this.perfil$.pipe(take(1), delay(300));
  }

  actualizarPerfil(cambios: Partial<Usuario>): Observable<Usuario> {
    const actualizado: Usuario = { ...this.perfil$.value, ...cambios };
    this.perfil$.next(actualizado);
    return this.perfil$.pipe(take(1), delay(300));
  }
}
