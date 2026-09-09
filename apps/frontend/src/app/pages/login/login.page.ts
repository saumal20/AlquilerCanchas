import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type ModoAcceso = 'login' | 'registro';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  modo: ModoAcceso = 'login';
  enviando = false;

  formLogin = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]],
  });

  formRegistro = this.fb.nonNullable.group({
    nombreCompleto: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    dni: [''],
    clave: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  cambiarModo(modo: ModoAcceso) {
    this.modo = modo;
  }

  enviarLogin() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.authService.login(this.formLogin.getRawValue()).subscribe(() => {
      this.enviando = false;
      this.cdr.markForCheck();
      this.router.navigateByUrl('/tabs/dashboard');
    });
  }

  enviarRegistro() {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.authService.registrar(this.formRegistro.getRawValue()).subscribe(() => {
      this.enviando = false;
      this.cdr.markForCheck();
      this.router.navigateByUrl('/tabs/dashboard');
    });
  }
}
