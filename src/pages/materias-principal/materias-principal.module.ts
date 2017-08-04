import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MateriasPrincipal } from './materias-principal';

@NgModule({
  declarations: [
    MateriasPrincipal,
  ],
  imports: [
    IonicPageModule.forChild(MateriasPrincipal),
  ],
  exports: [
    MateriasPrincipal
  ]
})
export class MateriasPrincipalModule {}
