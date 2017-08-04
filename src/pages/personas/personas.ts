import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PersonasService } from '../../app/personas.service';
import { PersonasamPage } from '../personasam/personasam';
import { PrincipalPage } from '../principal/principal';
/**
 * Generated class for the PersonasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-personas',
  templateUrl: 'personas.html',
})
export class PersonasPage {    
  estado: string;  
  listadoPersonas:string[];
  listadocero:string[];
  personas:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private PersonaService : PersonasService) {    
    this.personas="1";
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonasPage');
       this.PersonaService.TraerPersonas().then(
      data => {
        this.listadoPersonas=data;  
        this.listadocero=data;            
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
     this.navCtrl.push(PersonasamPage, { estado: this.estado,id:x['idUsuario'],desde:'persona' });
  }
  add(){
    this.estado='Alta';
    this.navCtrl.push(PersonasamPage, { estado: this.estado,desde:'persona' });
  }
  
  initializeItems() {
    this.listadoPersonas=this.listadocero;
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    
    // set val to the value of the searchbar
    let val = ev.target.value;        
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listadoPersonas = this.listadoPersonas.filter((item) => {
        return (item['nomap'].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
