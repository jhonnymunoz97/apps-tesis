import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {
        path: 'horarios',
        loadChildren: () => import('../pages/horarios/horarios.module').then(m => m.HorariosPageModule)
      },
      {
        path: 'vehiculos',
        loadChildren: () => import('../pages/vehiculos/vehiculos.module').then(m => m.VehiculosPageModule)
      },
      {
        path: 'rutas',
        loadChildren: () => import('../pages/rutas/rutas.module').then(m => m.RutasPageModule)
      },
      {
        path: 'ajustes',
        loadChildren: () => import('../pages/ajustes/ajustes.module').then(m => m.AjustesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
