import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
//import { NgModule } from '@angular/core';
//import { FormGroup, Validators, FormControl } from '@angular/forms';//FORMBUILDER CREA FORMS, FORMGROUP DEFINE UN FORMULARIO Y VALIDATORS CONTIENE VALIDACIONES PREDISEÑADAS

import { NativeAudio } from '@ionic-native/native-audio';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';

import { PersonasService } from '../../app/personas.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-asistencia',
  templateUrl: 'asistenciaAlumno.html'
})
export class AsistenciaAlumno {

  materiaElegidaNombre = "";
  materiaElegidaIdMateria = "";

  alumnoElegidoId;
  userId;
  
  presente;
  ausente;
  mediaFalta;
  ausenteJustificado;

  datosTraidosDetalle : any;
  asistencia: Array<any>;

  spinner;
  
  colores = {
    1 : 'green',
    2 : 'red',
    3 : 'orange'
  }

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private PersonaService : PersonasService,
    public toastCtrl: ToastController,
    private nativeAudio: NativeAudio,
    private deviceMotion: DeviceMotion,
    private device: Device,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public translate: TranslateService) {
      this.asistencia = [];
      this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
      this.GuardarDispositivo();
    translate.get('Cargando...').subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );
      this.spinner.present();
      this.storage.get('userInfo').then((val) => {
        this.userId = val.idUsuario;
        this.PersonaService.TraerIdAlumnoSegunIdUsuario(val.idUsuario)
          .then(data => {
            this.DesecharYCrearSpinner();
            this.alumnoElegidoId = data[0].idAlumno;
          });
      });
      
  }

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

  GuardarDispositivo(){
    this.PersonaService.GuardarDispositivo(this.userId, this.device.platform, this.device.version, this.device.manufacturer, this.device.model);
  }


  ResetearElegidos(){
    this.materiaElegidaNombre = "";
    this.materiaElegidaIdMateria = "";
    this.presente = false;
    this.ausente = false;
    this.mediaFalta = false;
    this.ausenteJustificado = false;
    this.datosTraidosDetalle = false;
    this.asistencia = [];
  }

  ElegirMateriaSegunAlumno() {
    this.translate.get(['Materias habilitadas','Error', 'Error, usted no tiene materias cargadas',
  'CANCELAR', 'Error, usted no eligió ninguna materia', 'Error, no hay asistencias cargadas para esta materia'])
    .subscribe(
      translatedText => {
this.ResetearElegidos();
    let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Materias habilitadas']);
    
    var subscription = this.deviceMotion.watchAcceleration({frequency: 500}).subscribe((acceleration: DeviceMotionAccelerationData) => {
      if (acceleration.z > 13) {
        this.ResetearElegidos();
        subscription.unsubscribe();
      }
    });
    
    this.spinner.present();
    this.PersonaService.TraerMateriasSegunAlumno(this.alumnoElegidoId)
      .then(data => {
        this.DesecharYCrearSpinner();
        if(data.length == 0){
          this.nativeAudio.play('error');
          alert = this.alertCtrl.create({
            title: translatedText['Error'],
            subTitle: translatedText['Error, usted no tiene materias cargadas'],
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
        alert.addButton(translatedText['CANCELAR']);
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

                this.spinner.present();
                this.PersonaService.TraerAlumnoAsistenciaSegunMateriaAlumnoResumen(this.materiaElegidaIdMateria, this.alumnoElegidoId)
                  .then(data => {
                    this.DesecharYCrearSpinner();
                    this.presente = false;
                    this.ausente = false;
                    this.mediaFalta = false;
                    this.ausenteJustificado = false;
                    for (var index = 0; index < data.length; index++) {
                      switch (data[index].asistencia) {
                        case "1":
                          this.presente = data[index].cantidad;
                          break;
                        case "2":
                          this.ausente = data[index].cantidad;
                          break;
                        case "3":
                          this.mediaFalta = data[index].cantidad;
                          break;
                        case "4":
                          this.ausenteJustificado = data[index].cantidad;
                          break;
                      }
                    }
                  });

                  this.spinner.present();
                  this.PersonaService.TraerAlumnoAsistenciaSegunMateriaAlumnoDetalle(this.materiaElegidaIdMateria, this.alumnoElegidoId)
                  .then(data => {
                    this.DesecharYCrearSpinner();
                    if(data.length == 0){
                      this.nativeAudio.play('error');
                      alert = this.alertCtrl.create({
                        title: translatedText['Error'],
                        subTitle: translatedText['Error, no hay asistencias cargadas para esta materia'],
                        buttons: ['OK']
                      });
                      alert.present();
                      return;
                    }
                    this.datosTraidosDetalle = data;
                  });
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