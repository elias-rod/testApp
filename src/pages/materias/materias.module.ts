import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Materias } from './materias';

@NgModule({
  declarations: [
    Materias,
  ],
  imports: [
    IonicPageModule.forChild(Materias),
  ],
  exports: [
    Materias
  ]
})
export class MateriasModule {}
