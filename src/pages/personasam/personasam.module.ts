import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonasamPage } from './personasam';

@NgModule({
  declarations: [
    PersonasamPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonasamPage),
  ],
  exports: [
    PersonasamPage
  ]
})
export class PersonasamPageModule {}
