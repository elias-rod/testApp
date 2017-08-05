import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
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
  Marker,
  Geocoder, 
  GeocoderRequest, 
  GeocoderResult
} from '@ionic-native/google-maps';

import { Globalization } from '@ionic-native/globalization';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  spinner;
  fechaCortaRegional;
  opcionesFechaLarga;
  fechaLargaRegional;
  numero;
  numeroRegional;
  monedaRegional;
  map : GoogleMap;
  arrayCodigosRegionales = {
    US : ['en-US', 'USD'],
    AR : ['es-AR', 'ARS'],
    BR : ['pt-BR', 'BRL'],
    IT : ['it-IT', 'EUR'],
    CN : ['zh-CN', 'CNY']
  };
  codigoRegional = 'AR';

  constructor(public navCtrl: NavController,
  private nativeAudio: NativeAudio,
  public loadingCtrl: LoadingController,
  private vibration: Vibration,
  public translate: TranslateService,
  private googleMaps: GoogleMaps,
  private geocoder: Geocoder) {
    this.nativeAudio.preloadSimple('yay', 'assets/sounds/yay.wav');
    this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
    
    translate.get('Cargando...').subscribe(
      translatedText => {
        this.spinner = this.loadingCtrl.create({
          content: translatedText
        });
      }
    );
    this.opcionesFechaLarga = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.numero = 123456.789;
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

  CambiarEjemplos(){
    this.fechaCortaRegional = (new Date()).toLocaleString(this.arrayCodigosRegionales[this.codigoRegional][0]);
    this.fechaLargaRegional = (new Date()).toLocaleString(this.arrayCodigosRegionales[this.codigoRegional][0], this.opcionesFechaLarga);
    this.numeroRegional = this.numero.toLocaleString(this.arrayCodigosRegionales[this.codigoRegional][0]);
    this.monedaRegional = this.numero.toLocaleString(this.arrayCodigosRegionales[this.codigoRegional][0], { style: 'currency', currency: this.arrayCodigosRegionales[this.codigoRegional][1]});
  }

  UbicarPosicion(lat, lng){
    let latLng = new LatLng(lat, lng);

    this.map.clear();

    let position: CameraPosition = {
      target: latLng,
      zoom: 3,
      tilt: 0
    }
    this.map.moveCamera(position);

    let markerOptions: MarkerOptions = {position: latLng};

    this.spinner.present();

    let marker = this.map.addMarker(markerOptions)
    .then((marker: Marker) => {
      marker.showInfoWindow();
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

    let geocoderRequest: GeocoderRequest = {position: latLng};

    this.geocoder.geocode(geocoderRequest)
    .then((results: GeocoderResult) => {
      this.codigoRegional = results[0].countryCode;
      this.CambiarEjemplos();
      this.DesecharYCrearSpinner();
      this.vibration.vibrate(500);
      this.nativeAudio.play('yay');
    });
  }
}