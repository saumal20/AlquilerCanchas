import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';

export function clavesCoincidenValidator(grupo: any) {
  const nueva = grupo.get('claveNueva')?.value;
  const confirmacion = grupo.get('confirmarClave')?.value;
  return nueva === confirmacion ? null : { clavesNoCoinciden: true };
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  guardando = false;
  cambiandoClave = false;
  fotoPreview: string | null = null;

  form = this.fb.nonNullable.group({
    nombreCompleto: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    dni: [''],
    notificacionesActivas: [true],
  });

  formClave = this.fb.nonNullable.group(
    {
      claveActual: ['', [Validators.required, Validators.minLength(6)]],
      claveNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarClave: ['', Validators.required],
    },
    { validators: clavesCoincidenValidator }
  );

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuarioService.obtenerPerfil().subscribe((usuario) => {
      this.form.patchValue(usuario);
      this.fotoPreview = usuario.fotoUrl ?? null;
      this.cdr.markForCheck();
    });
  }

  onFotoSeleccionada(evento: Event) {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) {
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      this.fotoPreview = lector.result as string;
      this.cdr.markForCheck();
    };
    lector.readAsDataURL(archivo);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    const cambios = { ...this.form.getRawValue(), fotoUrl: this.fotoPreview ?? undefined };
    this.usuarioService.actualizarPerfil(cambios).subscribe(async () => {
      this.guardando = false;
      this.cdr.markForCheck();
      await this.mostrarToast('Perfil actualizado.');
    });
  }

  cambiarClave() {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }
    this.cambiandoClave = true;
    const { claveActual, claveNueva } = this.formClave.getRawValue();
    this.authService.cambiarClave({ claveActual, claveNueva }).subscribe(async () => {
      this.cambiandoClave = false;
      this.formClave.reset();
      this.cdr.markForCheck();
      await this.mostrarToast('Contraseña actualizada.');
    });
  }

  private async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'cta',
      position: 'bottom',
    });
    await toast.present();
  }
}
