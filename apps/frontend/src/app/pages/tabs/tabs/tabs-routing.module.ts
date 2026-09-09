import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then((m) => m.DashboardPageModule),
      },
      {
        path: 'reservas',
        loadChildren: () =>
          import('../../reservas/reservas.module').then((m) => m.ReservasPageModule),
      },
      {
        path: 'partidos-abiertos',
        loadChildren: () =>
          import('../../partidos-abiertos/partidos-abiertos.module').then(
            (m) => m.PartidosAbiertosPageModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../../perfil/perfil.module').then((m) => m.PerfilPageModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
