import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { CambioClave, CredencialesLogin, RegistroUsuario, Usuario } from '../models/usuario.model';
import { AuthService } from './auth.service';

/**
 * Implementación falsa para el prototipo de venta (Fase A): no valida
 * credenciales ni persiste nada, solo simula latencia de red.
 */
@Injectable()
export class AuthServiceFake extends AuthService {
  login(credenciales: CredencialesLogin): Observable<Usuario> {
    const usuario: Usuario = {
      id: 'demo-usuario',
      nombreCompleto: 'Usuario Demo',
      correo: credenciales.correo,
      celular: '',
      notificacionesActivas: true,
    };
    return of(usuario).pipe(delay(400));
  }

  registrar(datos: RegistroUsuario): Observable<Usuario> {
    const usuario: Usuario = {
      id: 'demo-usuario',
      nombreCompleto: datos.nombreCompleto,
      correo: datos.correo,
      celular: datos.celular,
      dni: datos.dni,
      notificacionesActivas: true,
    };
    return of(usuario).pipe(delay(400));
  }

  cambiarClave(_cambio: CambioClave): Observable<void> {
    // Fase A: no hay clave real que validar — simula éxito.
    // Fase B: endpoint dedicado que revalida claveActual contra el hash guardado.
    return of(undefined).pipe(delay(400));
  }
}
