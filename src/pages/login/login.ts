import { AuthService } from './../../app/auth-service';
import { usuario } from './../../clases/usuario';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';//FORMBUILDER CREA FORMS, FORMGROUP DEFINE UN FORMULARIO Y VALIDATORS CONTIENE VALIDACIONES PREDISEÑADAS
//import { NgModule } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, NavParams } from 'ionic-angular';
//import { Asistencia } from '../asistencia/asistencia';
import { PrincipalPage } from '../principal/principal';
import { PersonasamPage } from '../personasam/personasam';
import { Storage } from '@ionic/storage';//STORAGE FOR IONIC
import { PersonasService } from '../../app/personas.service';

import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: Loading;
  nombre: string = '';
  password: any = '';
  formLogin: FormGroup;
  mensajeError: string = '';
  errorFormLogin: boolean;
  stockData: any;
  user: FirebaseListObservable<any>;

  //firebase
  miUsuario = {} as usuario;
  spinner;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private loadingCtrl: LoadingController,
  public formBuilder: FormBuilder, private alertCtrl: AlertController, private PersonaService : PersonasService,
  private local: Storage, private AngularAuth: AngularFireAuth, public database: AngularFireDatabase,
  public translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.get('Cargando...')
    .subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );
    this.local.ready().then(() => {
    this.local.set('userInfo', '');
  });
    
    this.user = this.database.list('/agenda');

    this.errorFormLogin = false;

    this.formLogin = formBuilder.group({


      nombre: [this.nombre, Validators.compose([Validators.required, Validators.maxLength(30)])],
      password: [this.password, Validators.compose([Validators.required, Validators.maxLength(30)])]
    });

  }

  //firebase

  Registrarse() {
    //this.navCtrl.push(RegistroPage);
     this.navCtrl.push(PersonasamPage, { estado: 'Alta',desde:'login' });

  };

  async Loguearse(miUsuario: usuario) {
    try {
      const result = await this.AngularAuth.auth.signInWithEmailAndPassword(miUsuario.email, miUsuario.password);

      if (result) {
        // meter una consulta a mysql para traer  info del user logueado : priviegios / prof o alumn / etc etc.
        this.spinner.present();
        this.PersonaService.TraerUsuariosPorEmail(miUsuario.email)
        .then(data => {
          this.DesecharYCrearSpinner();
          var array = [{
            "nombre": data[0].nombre, "apellido": data[0].apellido, "email": data[0].email,"rol": data[0].rolasignado, "img": data[0].img
          }];
          this.spinner.present();
          this.PersonaService.token(array)
          .then(tk=>{
            this.DesecharYCrearSpinner();
          })
          .catch(error => {
            this.DesecharYCrearSpinner();
          });              
          this.local.set("userInfo",data[0]);
          this.spinner.present();
          this.navCtrl.setRoot(PrincipalPage);
          this.DesecharYCrearSpinner();
          })
        .catch(error => {
          console.log(error);
        });
      }
      else{
        this.translate.get(["Error", "Usuario / password incorrecto"]).subscribe(
          translatedText => {
            this.showError(translatedText["Error"], translatedText["Usuario / password incorrecto"]);
          }
        );
      }
    }
    catch (e) {
      this.translate.get(["Error", "Usuario / password incorrecto"]).subscribe(
        translatedText => {
          this.showError(translatedText["Error"], translatedText["Usuario / password incorrecto"]);
        }
      );
    }
  };

  DesecharYCrearSpinner(){
    this.spinner.dismiss();
    this.translate.get('Cargando...').subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );
  }

  Rellenar(x) {
    switch (x) {
      case 1:
        this.nombre = 'pablo@utn.com';
        this.password = 'asd123';

        break;
      case 2:
        this.nombre = 'octavio@utn.com';
        this.password = 'asd123';

        break;
      case 3:
        this.nombre = 'admin@utn.com';
        this.password = 'asd123';
        break;
      case 4:
        this.nombre='administrativo1@utn.com';
        this.password='asd123'
    }


  }

  loguear() {
    this.formLogin.value.nombre = this.nombre;
    this.formLogin.value.password = this.password;

    if (this.formLogin.valid && this.password.length >= 6) {
      this.miUsuario.email = this.nombre;
      this.miUsuario.password = this.password;
      this.Loguearse(this.miUsuario);

    }
    else{
      this.translate.get(["Error", "Usuario / password incorrecto"]).subscribe(
        translatedText => {
          this.showError(translatedText["Error"], translatedText["Usuario / password incorrecto"]);
        }
      );
    }
  }

  showError(titulo, texto) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}