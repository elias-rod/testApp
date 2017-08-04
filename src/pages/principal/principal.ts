import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';//STORAGE FOR IONIC

import { PersonasPage } from '../personas/personas';
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { Readme } from '../readme/readme';
import { Archivos } from '../archivos/archivos';
import { Idioma } from '../idioma/idioma';
import { Localizacion } from '../localizacion/localizacion';
import { PersonasamPage } from '../personasam/personasam';
import { Encuesta } from '../encuesta/encuesta';
import { Graficos } from '../graficos/graficos';
import { AsistenciaAdministrativo } from '../asistenciaAdministrativo/asistenciaAdministrativo';
import { AsistenciaAlumno } from '../asistenciaAlumno/asistenciaAlumno';
import { AsistenciaProfesor } from '../asistenciaProfesor/asistenciaProfesor';
import { MateriasPrincipal } from '../materias-principal/materias-principal';
import { LoadingController } from 'ionic-angular';


import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  nombre:string;
  idusuario:number;
  imagen:string;
  rol:string;
  asistencias:boolean;
  personas:boolean;
  materiasA:boolean;
  administrativas:boolean;
  alumnos:boolean;
  profesor:boolean;
  archivos:boolean;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,public navParams: NavParams,public modalCtrl: ModalController,private storage: Storage,
    public translate: TranslateService) {
    this.asistencias=true;
    this.personas=true;
    this.materiasA=true;
    this.administrativas=true;
    this.alumnos=true;
    this.profesor=true;
    this.archivos=true;
}

  ionViewDidLoad() {
    //this.presentLoading();
    console.log('ionViewDidLoad PrincipalPage');
     this.storage.get('userInfo').then((val) => {
    //   console.info(val.imagen)
      // console.info(val.nombre)
      this.idusuario=val.idUsuario;      
      this.imagen=val.imagen;
      this.nombre=val.nombre;        
      this.rol=val.idRol;
      console.info(this.rol)  
     switch(this.rol){
       case '1':
        this.archivos=false;
        this.asistencias=false;
        this.materiasA=true;
        this.personas=true;
        this.administrativas=true;
        this.alumnos=false;
        this.profesor=false; //estaba true
       break;
       case '2':
        this.archivos=true;
        this.asistencias=true;
        this.materiasA=true;
        this.personas=true;
        this.administrativas=true;
        this.alumnos=false;
        this.profesor=false;
       break;
       case '3':
        this.archivos=false;
        this.asistencias=false;
        this.materiasA=false;
        this.personas=false;
        this.administrativas=false;
        this.alumnos=true;
        this.profesor=false;
       break;
       case '4':
        this.archivos=false;
        this.asistencias=true;
        this.materiasA=false;
        this.personas=false;
        this.administrativas=false;
        this.alumnos=false;
        this.profesor=true;
       break;       
     }
      })
  }

  /*presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "",
      duration: 1500
    });
    loader.present();
  }*/

  editPerfil(){    
    this.navCtrl.push(PersonasamPage, { estado: 'Modificar',id:this.idusuario });
  }
  persona(){    
    this.navCtrl.setRoot(PersonasPage);
  };
  irArchivos(){
    this.navCtrl.push(Archivos);
  }
  irIdioma(){
    this.navCtrl.push(Idioma);
  }
  irLocalizacion(){
    this.navCtrl.push(Localizacion);
  }
  irAsistencia(){
    this.navCtrl.push(AsistenciaAdministrativo);
  }
  irAsistenciaA(){
    this.navCtrl.push(AsistenciaAlumno);
  }
  irAsistenciaP(){
    this.navCtrl.push(AsistenciaProfesor);
  }
  irReadme(){
    this.navCtrl.push(Readme);
  }
  materias(){
    this.navCtrl.setRoot(MateriasPrincipal);
  }
  acercade(){
    this.navCtrl.setRoot(AboutPage);
  }

  estadisticas(){
    if(this.rol=='3')
    this.navCtrl.setRoot(Encuesta);
    else
    this.navCtrl.setRoot(Graficos);
  };
  salir(){
    this.storage.ready().then(() => {
        this.storage.set('userInfo', '');    
    });
    this.navCtrl.setRoot(LoginPage);
  }
}
