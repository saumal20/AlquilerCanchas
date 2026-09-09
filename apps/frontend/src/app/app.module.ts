import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './core/services/auth.service';
import { AuthServiceFake } from './core/services/auth.service.fake';
import { UsuarioService } from './core/services/usuario.service';
import { UsuarioServiceFake } from './core/services/usuario.service.fake';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AuthService, useClass: AuthServiceFake },
    { provide: UsuarioService, useClass: UsuarioServiceFake },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
