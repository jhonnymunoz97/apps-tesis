import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutasPageRoutingModule } from './rutas-routing.module';

import { RutasPage } from './rutas.page';
import { GoogleMapsComponent } from 'src/app/googleMap/google-maps/google-maps.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RutasPageRoutingModule],
  declarations: [RutasPage, GoogleMapsComponent],
})
export class RutasPageModule {}
