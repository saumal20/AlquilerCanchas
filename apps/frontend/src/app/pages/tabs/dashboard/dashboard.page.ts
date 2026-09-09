import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';

interface AccesoRapido {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  nombreUsuario = '';

  accesos: AccesoRapido[] = [
    {
      titulo: 'Reservas',
      descripcion: 'Buscá una cancha y reservá en minutos.',
      icono: 'calendar-outline',
      ruta: '/tabs/reservas',
    },
    {
      titulo: 'Partidos abiertos',
      descripcion: 'Sumate a un partido o publicá el tuyo.',
      icono: 'people-outline',
      ruta: '/tabs/partidos-abiertos',
    },
    {
      titulo: 'Mi perfil',
      descripcion: 'Tus datos, foto y preferencias.',
      icono: 'person-outline',
      ruta: '/tabs/perfil',
    },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuarioService.obtenerPerfil().subscribe((usuario) => {
      this.nombreUsuario = usuario.nombreCompleto.split(' ')[0];
      // Ionic detacha la detección de cambios de las páginas gestionadas por
      // IonRouterOutlet/IonicRouteStrategy; sin este markForCheck() manual,
      // una actualización que llega después de un delay() async no se pinta.
      this.cdr.markForCheck();
    });
  }
}
