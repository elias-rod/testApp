import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { File } from '@ionic-native/file';

import { PersonasService } from '../../app/personas.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-archivos',
  templateUrl: 'archivos.html'
})

export class Archivos {
  spinner;
  objeto;
  mostrar;
  constructor(public navCtrl: NavController,
    private PersonaService : PersonasService,
    public toastCtrl: ToastController,
    private nativeAudio: NativeAudio,
    public loadingCtrl: LoadingController,
    private vibration: Vibration,
    public file: File,
    public translate: TranslateService) {
      this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
      this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
      translate.get('Cargando...').subscribe(
        translatedText => {
          this.spinner = this.loadingCtrl.create({
            content: translatedText
          });
        }
      );
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

  ExportarMaterias(){
    this.spinner.present();
    this.PersonaService.TraerMaterias()
    .then(data => {
      this.file.createFile(this.file.externalDataDirectory, "materias.js", true)
      .then(() => {
        this.file.writeExistingFile(this.file.externalDataDirectory, "materias.js", data)
        .then(() => {
          this.DesecharYCrearSpinner();
          this.vibration.vibrate(100);
          this.nativeAudio.play('yay');
          this.translate.get('Exportado')
          .subscribe(
            translatedText => {
              let toast = this.toastCtrl.create({
                message: translatedText,
                duration: 1000
              });
              toast.present();
            }
          );
        });
      });
    }); 
  }

  ImportarMaterias(){
    this.spinner.present();
    this.mostrar = true;
    this.file.readAsText(this.file.externalDataDirectory, "materias.js")
    .then(texto => {
      this.objeto = texto;
      this.DesecharYCrearSpinner();
      this.vibration.vibrate(100);
      this.nativeAudio.play('yay');
      this.translate.get('Importado')
      .subscribe(
        translatedText => {
          let toast = this.toastCtrl.create({
            message: translatedText,
            duration: 1000
          });
          toast.present();
        }
      );
    })
    .catch(error =>{
      let toast = this.toastCtrl.create({
        message: error,
        duration: 1000
      });
      toast.present();
      this.DesecharYCrearSpinner();
    });
  }
  Limpiar(){
    this.mostrar = false;
  }
}