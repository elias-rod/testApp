import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { Storage } from '@ionic/storage';
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
  selector: 'page-localizacion',
  templateUrl: 'localizacion.html'
})


export class Localizacion {
  
  mostrar;
  spinner;
  map : GoogleMap;
  fecha;
  fechaLarga;
  region;

  constructor(public navCtrl: NavController,
  public toastCtrl: ToastController,
  private nativeAudio: NativeAudio,
  public loadingCtrl: LoadingController,
  private vibration: Vibration,
  public alertCtrl: AlertController,
  public translate: TranslateService,
  private googleMaps: GoogleMaps,
  private storage: Storage,
  private globalization: Globalization) {
    this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
    this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
    this.mostrar = false;
    translate.get('Cargando...').subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );

    this.globalization.dateToString(new Date(),{ formatLength: 'short', selector: 'date and time' })
    .then((date)=>{
      this.fecha = date.value;
    });

    this.globalization.dateToString(new Date(),{ formatLength: 'long', selector: 'date and time' })
    .then((date)=>{
      this.fechaLarga = date.value;
    });

    this.globalization.getPreferredLanguage()
    .then(reg => {
      this.region = reg.value;
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

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('map');
    this.map = this.googleMaps.create(element);
    this.spinner.present();
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(()=>{
      this.mostrar = true;
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

    this.storage.set('formato', formato);
  }
}