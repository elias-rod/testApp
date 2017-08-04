import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Graficos } from './graficos';

@NgModule({
  declarations: [
    Graficos,
  ],
  imports: [
    IonicPageModule.forChild(Graficos),
  ],
  exports: [
    Graficos
  ]
})
export class GraficosModule {}
