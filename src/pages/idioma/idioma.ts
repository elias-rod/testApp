import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-idioma',
  templateUrl: 'idioma.html'
})

export class Idioma {
  spinner;
  constructor(public navCtrl: NavController,
  public toastCtrl: ToastController,
  private nativeAudio: NativeAudio,
  public loadingCtrl: LoadingController,
  private vibration: Vibration,
  public translate: TranslateService) {
    this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
    this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
  }

  ElegirEspanol(){
    this.translate.setDefaultLang('es');
    this.vibration.vibrate(100);
    this.nativeAudio.play('yay');
  }

  ElegirIngles(){
    this.translate.setDefaultLang('en');
    this.vibration.vibrate(100);
    this.nativeAudio.play('yay');
  }

  ElegirItaliano(){
    this.translate.setDefaultLang('it');
    this.vibration.vibrate(100);
    this.nativeAudio.play('yay');
  }

  ElegirPortugues(){
    this.translate.setDefaultLang('po');
    this.vibration.vibrate(100);
    this.nativeAudio.play('yay');
  }
}