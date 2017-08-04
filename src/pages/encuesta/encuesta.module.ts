import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Encuesta } from './encuesta';

@NgModule({
  declarations: [
    Encuesta,
  ],
  imports: [
    IonicPageModule.forChild(Encuesta),
  ],
  exports: [
    Encuesta
  ]
})
export class EncuestaModule {}
