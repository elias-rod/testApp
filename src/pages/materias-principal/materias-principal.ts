import {ServMaterias} from '../../providers/serv-materias';//AGRE
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrincipalPage } from '../principal/principal';
import { Materias } from '../materias/materias';

@IonicPage()
@Component({
  selector: 'page-materias-principal',
  templateUrl: 'materias-principal.html',
providers :[ServMaterias]
})
export class MateriasPrincipal {
  estado: string;
  listadoPersonas:string[];
  listadocero:string[];
  personas:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private ServMaterias:ServMaterias) {
    this.personas="1";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonasPage');
    this.ServMaterias.TraerMaterias()
      .then(data => {
        this.listadoPersonas=data;
        // this.listadocero=data
      })
      .catch(error => {
          console.log('ERROR: '+error);
        });
  }
  back(){
    this.navCtrl.setRoot(PrincipalPage);
  }
  modificar(x){
     this.estado='Modificar';
     this.navCtrl.push(Materias, { estado: this.estado,idMateria:x['idMateria'] });
  }
  add(){
    this.estado='Alta';
    this.navCtrl.push(Materias, { estado: this.estado });
  }

  initializeItems() {
    this.listadoPersonas=this.listadocero;
  }


}
