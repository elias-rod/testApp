import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';

import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';

import { PersonasService } from '../../app/personas.service';
import { PrincipalPage } from '../principal/principal';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-asistencia',
  templateUrl: 'asistenciaProfesor.html'
})
export class AsistenciaProfesor {
  offset = new Date().getTimezoneOffset() * 60000; //TRANSFORMACIÓN DEL OFFSET EN MILISEGUNDOS
  fecha = new Date(Date.now() - this.offset).toISOString().substring(0, 10);
  fechaPartes : any;
  formatoFecha : string = "";

  diaElegido : number;
  materiaElegidaNombre = "";
  materiaElegidaIdMateria = "";
  
  datosTraidos : any;
  asistencia: Array<any>;

  profesorId;
  userId;

  spinner;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private PersonaService : PersonasService,
    public toastCtrl: ToastController,
    private vibration: Vibration,
    private nativeAudio: NativeAudio,
    public device: Device,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public translate: TranslateService) {
      this.ActualizarDia();
      this.asistencia = [];
      this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
      this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
      translate.get('Cargando...')
      .subscribe(
        translatedText => {
          this.spinner = this.loadingCtrl.create({
            content: translatedText
          });
        }
      );
      storage.get('formato').then((val) => {
        this.formatoFecha = val || "DD/MM/YYYY";
      });
      this.spinner.present();
      this.storage.get('userInfo').then((val) => {
        this.userId = val.idUsuario;
        this.GuardarDispositivo();
        this.PersonaService.TraerIdProfesorSegunIdUsuario(val.idUsuario)
          .then(data => {
            this.DesecharYCrearSpinner();
            this.profesorId = data[0].idProfesor;
          });
      });
  }
  
  DesecharYCrearSpinner(){
    this.spinner.dismiss();
    this.translate.get('Cargando...')
    .subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );
  }

  GuardarDispositivo(){
    this.PersonaService.GuardarDispositivo(this.userId, this.device.platform, this.device.version, this.device.manufacturer, this.device.model);
  }

  ActualizarDia(){
    this.ResetearElegidos();
    this.fechaPartes = this.fecha.split('-');    
    this.diaElegido = new Date(this.fechaPartes[0], this.fechaPartes[1]-1, this.fechaPartes[2]).getDay();
  }

  GuardarAsistencia(asistencia){
    this.translate.get(['Guardado'])
    .subscribe(
      translatedText => {
           if (asistencia.valid) {
      asistencia._submitted = false;
      this.spinner.present();
      this.PersonaService.GuardarAsistencia(this.fecha, this.materiaElegidaIdMateria, asistencia.value)
      .then(data => {
        this.DesecharYCrearSpinner();
        this.vibration.vibrate(500);
        this.nativeAudio.play('yay');
        let toast = this.toastCtrl.create({
          message: translatedText['Guardado'],
          duration: 1000
        });
        toast.present();
        //DEMORA DE X MILISEGUNDOS PARA GENERAR NUEVO CUESTIONARIO
        setTimeout(() => {
          this.navCtrl.setRoot(PrincipalPage);
        //QUE DEMORE 1000 MILISEGUNDOS
        }, 1500);
      })
      .catch(error => {
        console.log(error);
      });
    }
      }
    );
  }

  ResetearElegidos(){
    this.materiaElegidaNombre = "";
    this.materiaElegidaIdMateria = "";
    this.datosTraidos = false;
    this.asistencia = [];
  }

  ElegirMateriaSegunDiaYProfesor() {
    this.translate.get(['Materias activas hoy','Error','Error, se eligió un día domingo. Los domingos no hay clases',
  'Error, usted no tiene clases este dia de la semana', 'Error, usted no eligió ninguna materia'])
    .subscribe(
      translatedText => {
    this.ResetearElegidos();
    let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Materias activas hoy']);
    this.spinner.present();
    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      this.DesecharYCrearSpinner();
      return;
    }
    this.spinner.present();
    this.PersonaService.TraerMateriasSegunDiaYProfesor(this.diaElegido, this.profesorId)
      .then(data => {
        this.DesecharYCrearSpinner();
        if(data.length == 0){
          this.nativeAudio.play('error');
          alert = this.alertCtrl.create({
            title: translatedText['Error'],
            subTitle: translatedText['Error, usted no tiene clases este dia de la semana'],
            buttons: ['OK']
          });
          alert.present();
          return;
        }
        for (var index = 0; index < data.length; index++) {
          alert.addInput({
            type: 'radio',
            label: data[index].nombre,
            value: data[index].idMateria
          });
        }
        alert.addButton('CANCELAR');
        alert.addButton({
          text: 'OK',
          handler: materiaElegida => {
            if(!materiaElegida){
              this.nativeAudio.play('error');
              alert = this.alertCtrl.create({
                title: translatedText['Error'],
                subTitle: translatedText['Error, usted no eligió ninguna materia'],
                buttons: ['OK']
              });
              alert.present();
              return;
            }
            this.spinner.present();
            this.PersonaService.TraerMateriaSegunIdMateria(materiaElegida)
              .then(data => {
                this.DesecharYCrearSpinner();
                this.materiaElegidaNombre = data[0].nombre;
                this.materiaElegidaIdMateria = data[0].idMateria;
              });
            this.spinner.present();
            this.PersonaService.TraerAlumnosAsistenciaSegunFechaMateria(this.fecha, materiaElegida)
              .then(data => {
                this.DesecharYCrearSpinner();
                if (data.length == 0) {
                  this.spinner.present();
                  this.PersonaService.TraerAlumnosSegunMateria(materiaElegida)
                    .then(data => {
                      this.DesecharYCrearSpinner();
                      for (var index = 0; index < data.length; index++) {
                        data[index].seleccionado = false;                        
                      }
                      this.datosTraidos = data;
                    });
                }
                else{
                  this.datosTraidos = data;
                }
              });
          }
        });
        alert.present();
      })
      .catch(error => {
        console.log(error);
      });
      }
    );

  }
}