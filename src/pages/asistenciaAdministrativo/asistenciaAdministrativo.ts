import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
//import { FormGroup, Validators, FormControl } from '@angular/forms';//FORMBUILDER CREA FORMS, FORMGROUP DEFINE UN FORMULARIO Y VALIDATORS CONTIENE VALIDACIONES PREDISEÑADAS
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';
import { Device } from '@ionic-native/device';
//import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PersonasService } from '../../app/personas.service';
import { PrincipalPage } from '../principal/principal';
import { Storage } from '@ionic/storage';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-asistencia',
  templateUrl: 'asistenciaAdministrativo.html'
})
export class AsistenciaAdministrativo {
  offset = new Date().getTimezoneOffset() * 60000; //TRANSFORMACIÓN DEL OFFSET EN MILISEGUNDOS
  fecha = new Date(Date.now() - this.offset).toISOString().substring(0, 10);
  fechaPartes : any;
  formatoFecha : string = "";

  filtro = "";
  diaElegido : number;
  materiaElegidaNombre = "";
  materiaElegidaIdMateria = "";
  profesorElegidoId = "";
  profesorElegidoNombre = "";
  aulaElegidaId = "";
  aulaElegidaNumero = "";
  alumnoElegidoId = "";
  alumnoElegidoNombre = "";

  datosTraidos : any;
  asistencia: Array<any>;

  userId;

  spinner;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private PersonaService : PersonasService,
    public toastCtrl: ToastController,
    private vibration: Vibration,
    private nativeAudio: NativeAudio,
    private device: Device,
    public loadingCtrl: LoadingController,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    public translate: TranslateService) {
      this.ActualizarDia();
      this.asistencia = [];
      this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
      this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
      translate.get('Cargando...').subscribe(
        translatedText => {
          this.spinner = this.loadingCtrl.create({
            content: translatedText
          });
        }
      );
      storage.get('formato').then((val) => {
        this.formatoFecha = val || "DD/MM/YYYY";
      });
      this.storage.get('userInfo').then((val) => {
        this.userId = val.idUsuario;
        this.GuardarDispositivo();
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
    this.PersonaService.GuardarDispositivo(4, this.device.platform, this.device.version, this.device.manufacturer, this.device.model);
  }

  ActualizarDia(){
    this.ResetearElegidos();
    this.filtro = "";
    this.fechaPartes = this.fecha.split('-');
    this.diaElegido = new Date(this.fechaPartes[0], this.fechaPartes[1]-1, this.fechaPartes[2]).getDay();
  }

  GuardarAsistencia(asistencia){
    if (asistencia.valid) {
      asistencia._submitted = false;
      this.spinner.present();
      this.PersonaService.GuardarAsistencia(this.fecha, this.materiaElegidaIdMateria, asistencia.value)
        .then(data => {
          this.DesecharYCrearSpinner();
          this.vibration.vibrate(100);
          this.nativeAudio.play('yay');
          this.translate.get('Guardado')
          .subscribe(
            translatedText => {
              let toast = this.toastCtrl.create({
                message: translatedText,
                duration: 1000
              });
              toast.present();
            }
          );

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

  ResetearElegidos(){
    this.materiaElegidaNombre = "";
    this.materiaElegidaIdMateria = "";
    this.profesorElegidoId = "";
    this.profesorElegidoNombre = "";
    this.datosTraidos = false;
    this.aulaElegidaId = "";
    this.aulaElegidaNumero = "";
    this.alumnoElegidoId = "";
    this.alumnoElegidoNombre = "";
    this.asistencia = [];
  }

  ElegirAlumno() {
    this.translate.get(["Alumnos activos hoy", "Error",
    'Error, se eligió un día domingo. Los domingos no hay clases', 'CANCELAR',
    'Error, usted no eligió ningún alumno'])
    .subscribe(
      translatedText => {
        this.ResetearElegidos();
        let alert = this.alertCtrl.create();
        alert.setTitle(translatedText['Alumnos activos hoy']);
        if(this.diaElegido == 0){
          this.nativeAudio.play('error');
          this.vibration.vibrate(500);
          alert = this.alertCtrl.create({
            title: translatedText['Error'],
            subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
            buttons: ['OK']
          });
          alert.present();
          return;
        }
        this.spinner.present();
        this.PersonaService.TraerAlumnosSegunDia(this.diaElegido)
          .then(data => {
            this.DesecharYCrearSpinner();
            for (var index = 0; index < data.length; index++) {
              alert.addInput({
                type: 'radio',
                label: data[index].apellido + ", " + data[index].nombre,
                value: data[index].idAlumno
              });
            }
            alert.addButton(translatedText['CANCELAR']);
            alert.addButton({
              text: 'OK',
              handler: alumnoElegidoId => {
                if(!alumnoElegidoId){
                  this.nativeAudio.play('error');
                  alert = this.alertCtrl.create({
                    title: translatedText['Error'],
                    subTitle: translatedText['Error, usted no eligió ningún alumno'],
                    buttons: ['OK']
                  });
                  alert.present();
                  return;
                }
                this.alumnoElegidoId = alumnoElegidoId;
                this.spinner.present();
                this.PersonaService.TraerAlumnoSegunId(this.alumnoElegidoId)
                .then(data => {
                  this.DesecharYCrearSpinner();
                  this.alumnoElegidoNombre = data[0].apellido + ", " + data[0].nombre;
                })
                .catch(error => {
                  console.log(error);
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

  ElegirMateriaSegunDiaYAlumno() {
    this.translate.get(['Materias activas hoy', 'Error', 'Error, se eligió un día domingo. Los domingos no hay clases',
    'CANCELAR', 'Error, usted no eligió ninguna materia'])
    .subscribe(
      translatedText => {
        let alert = this.alertCtrl.create();
        alert.setTitle(translatedText['Materias activas hoy']);
        if(this.diaElegido == 0){
          this.vibration.vibrate(500);
          this.nativeAudio.play('error');
          alert = this.alertCtrl.create({
            title: translatedText['Error'],
            subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
            buttons: ['OK']
          });
          alert.present();
          return;
        }
        this.spinner.present();
        this.PersonaService.TraerMateriasSegunDiaYAlumno(this.diaElegido, this.alumnoElegidoId)
        .then(data => {
          this.DesecharYCrearSpinner();
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
                });
              this.spinner.present();
              this.PersonaService.TraerAlumnoAsistenciaSegunFechaMateriaAlumno(this.fecha, this.materiaElegidaIdMateria, this.alumnoElegidoId)
                .then(data => {
                  this.DesecharYCrearSpinner();
                  if (data.length == 0) {
                    this.PersonaService.TraerAlumnoSegunId(this.alumnoElegidoId)
                      .then(data => {
                        data[0].seleccionado = false;
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

  ElegirAulaQR() {
    this.translate.get(['Error', 'Error, se eligió un día domingo. Los domingos no hay clases',
    'Error, se cancelo la captura', 'Error, en el aula elegida no se dictan clases hoy',
    'El código esta borroso o la cámara no captura correctamente el mismo']).subscribe(
      translatedText => {
this.ResetearElegidos();
    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
        let alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    this.barcodeScanner.scan().then((barcodeData) => {
      if(barcodeData.cancelled){
        this.nativeAudio.play('error');
        let alert = this.alertCtrl.create({
          title: translatedText['Error'],
          subTitle: translatedText['Error, se cancelo la captura'],
          buttons: ['OK']
        });
        alert.present();
        return;
      }
      else{
        this.spinner.present();
        this.PersonaService.TraerAulasSegunDia(this.diaElegido)
        .then(data => {
          this.DesecharYCrearSpinner();
          for (var index = 0; index < data.length; index++) {
            if(data[index].numero == barcodeData.text){
              this.aulaElegidaNumero = barcodeData.text;
              this.aulaElegidaId = data[index].idAula;
              return;
            }
          }
          this.nativeAudio.play('error');
          let alert = this.alertCtrl.create({
            title: translatedText['Error'],
            subTitle: translatedText['Error, en el aula elegida no se dictan clases hoy'],
            buttons: ['OK']
          });
          alert.present();
          return;
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
    (err) => {
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
      let alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['El código esta borroso o la cámara no captura correctamente el mismo'],
        buttons: ['OK']
      });
      alert.present();
      return;
    });
      }
    );
  }


  ElegirAula() {
    this.translate.get(['Aulas activas hoy', 'Error', 'Error, se eligió un día domingo. Los domingos no hay clases',
    'Error, usted no eligió ningún aula','CANCELAR'])
    .subscribe(
      translatedText => {
    this.ResetearElegidos();
    let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Aulas activas hoy']);
    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
      alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.spinner.present();
    this.PersonaService.TraerAulasSegunDia(this.diaElegido)
      .then(data => {
        this.DesecharYCrearSpinner();
        for (var index = 0; index < data.length; index++) {
          alert.addInput({
            type: 'radio',
            label: data[index].numero,
            value: data[index].idAula
          });
        }
        alert.addButton(translatedText['CANCELAR']);
        alert.addButton({
          text: 'OK',
          handler: aulaElegidaId => {
            if(!aulaElegidaId){
              this.nativeAudio.play('error');
              alert = this.alertCtrl.create({
                title: translatedText['Error'],
                subTitle: translatedText['Error, usted no eligió ningún aula'],
                buttons: ['OK']
              });
              alert.present();
              return;
            }
            this.aulaElegidaId = aulaElegidaId;
            this.spinner.present();
            this.PersonaService.TraerAulaSegunId(this.aulaElegidaId)
            .then(data => {
              this.DesecharYCrearSpinner();
              this.aulaElegidaNumero = data[0].numero;
            })
            .catch(error => {
              console.log(error);
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

  ElegirMateriaSegunDiaYAula() {
    this.translate.get(['Materias activas hoy','Error','Error, se eligió un día domingo. Los domingos no hay clases',
  'Error, usted no eligió ninguna materia','CANCELAR'])
    .subscribe(
      translatedText => {
let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Materias activas hoy']);
    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
      alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.spinner.present();
    this.PersonaService.TraerMateriasSegunDiaYAula(this.diaElegido, this.aulaElegidaId)
      .then(data => {
        this.DesecharYCrearSpinner();
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

  ElegirProfesor() {
    this.translate.get(['Profesores activos hoy','Error','CANCELAR','Error, se eligió un día domingo. Los domingos no hay clases',
  'Error, usted no eligió ningún profesor'])
    .subscribe(
      translatedText => {
    this.ResetearElegidos();
    let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Profesores activos hoy']);
    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
      alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.spinner.present();
    this.PersonaService.TraerProfesoresSegunDia(this.diaElegido)
      .then(data => {
        this.DesecharYCrearSpinner();
        for (var index = 0; index < data.length; index++) {
          alert.addInput({
            type: 'radio',
            label: data[index].apellido + ", " + data[index].nombre,
            value: data[index].idProfesor
          });
        }
        alert.addButton(translatedText['CANCELAR']);
        alert.addButton({
          text: 'OK',
          handler: profesorElegidoId => {
            if(!profesorElegidoId){
              this.nativeAudio.play('error');
              alert = this.alertCtrl.create({
                title: translatedText['Error'],
                subTitle: translatedText['Error, usted no eligió ningún profesor'],
                buttons: ['OK']
              });
              alert.present();
              return;
            }
            this.profesorElegidoId = profesorElegidoId;
            this.spinner.present();
            this.PersonaService.TraerProfesorSegunId(this.profesorElegidoId)
            .then(data => {
              this.DesecharYCrearSpinner();
              this.profesorElegidoNombre = data[0].apellido + ", " + data[0].nombre;
            })
            .catch(error => {
              console.log(error);
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

  ElegirMateriaSegunDiaYProfesor() {
    this.translate.get(['Materias activas hoy','Error','Error, se eligió un día domingo. Los domingos no hay clases',
  'CANCELAR','Error, usted no eligió ninguna materia'])
    .subscribe(
      translatedText => {
    let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Materias activas hoy']);
    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
      alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.spinner.present();
    this.PersonaService.TraerMateriasSegunDiaYProfesor(this.diaElegido, this.profesorElegidoId)
      .then(data => {
        this.DesecharYCrearSpinner();
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

  ElegirMateria() {
    this.translate.get(['Materias activas hoy','Error', 'Error, se eligió un día domingo. Los domingos no hay clases',
    'CANCELAR','Error, usted no eligió ninguna materia'])
    .subscribe(
      translatedText => {
    this.ResetearElegidos();

    let alert = this.alertCtrl.create();
    alert.setTitle(translatedText['Materias activas hoy']);

    if(this.diaElegido == 0){
      this.nativeAudio.play('error');
      this.vibration.vibrate(500);
      alert = this.alertCtrl.create({
        title: translatedText['Error'],
        subTitle: translatedText['Error, se eligió un día domingo. Los domingos no hay clases'],
        buttons: ['OK']
      });
      alert.present();
      return;
    }
    this.spinner.present();
    this.PersonaService.TraerMateriasSegunDia(this.diaElegido)
      .then(data => {
        this.DesecharYCrearSpinner();
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