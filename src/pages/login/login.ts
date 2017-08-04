import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';

import { TranslateService } from '@ngx-translate/core';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

import { Globalization } from '@ionic-native/globalization';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  spinner;
  fecha;
  fechaCorta;
  fechaLarga;
  map : GoogleMap;

  constructor(public navCtrl: NavController,
  public toastCtrl: ToastController,
  private nativeAudio: NativeAudio,
  public loadingCtrl: LoadingController,
  private vibration: Vibration,
  public translate: TranslateService,
  private googleMaps: GoogleMaps,
  private globalization: Globalization) {
    this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
    this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
    
    translate.get('Cargando...').subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );

    this.globalization.dateToString(new Date(),{ formatLength: 'short', selector: 'date and time' })
    .then((date)=>{
      this.fechaCorta = date.value;
    });

    this.globalization.dateToString(new Date(),{ formatLength: 'long', selector: 'date and time' })
    .then((date)=>{
      this.fechaLarga = date.value;
    });
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

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('map');
    this.map = this.googleMaps.create(element);
    this.spinner.present();
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(()=>{
      this.DesecharYCrearSpinner();
    });
  }

  ubicarPosicion(lat, lng, formato){
    let latLng = new LatLng(lat, lng);
    this.map.clear();
    let position: CameraPosition = {
      target: latLng,
      zoom: 3,
      tilt: 0
    }
    this.map.moveCamera(position);
    let markerOptions: MarkerOptions = {
      position: latLng
    };

    this.spinner.present();
    let marker = this.map.addMarker(markerOptions)
    .then((marker: Marker) => {
      marker.showInfoWindow();
      this.DesecharYCrearSpinner();
      this.vibration.vibrate(500);
      this.nativeAudio.play('yay');
      this.translate.get(['Formato regional cambiado'])
      .subscribe(
        translatedText => {
          let toast = this.toastCtrl.create({
          message: translatedText['Formato regional cambiado'],
          duration: 3000
        });
        toast.present();
      });
    });
  }
}