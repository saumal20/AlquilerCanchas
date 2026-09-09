import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartidosAbiertosPage } from './partidos-abiertos.page';

const routes: Routes = [
  {
    path: '',
    component: PartidosAbiertosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartidosAbiertosPageRoutingModule {}
