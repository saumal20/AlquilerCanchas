import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { PartidosAbiertosPageRoutingModule } from './partidos-abiertos-routing.module';

import { PartidosAbiertosPage } from './partidos-abiertos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartidosAbiertosPageRoutingModule
  ],
  declarations: [PartidosAbiertosPage]
})
export class PartidosAbiertosPageModule {}
