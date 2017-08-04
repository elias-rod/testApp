import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';
import { DeviceMotion } from '@ionic-native/device-motion';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { Globalization } from '@ionic-native/globalization';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule, Http } from '@angular/http';


import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegistroPage } from '../pages/registro/registro';

import { Materias } from '../pages/materias/materias'
import { MateriasPrincipal } from '../pages/materias-principal/materias-principal'
import { AboutPage } from '../pages/about/about';
import { PrincipalPage } from '../pages/principal/principal';

import { AsistenciaAdministrativo } from '../pages/asistenciaAdministrativo/asistenciaAdministrativo';
import { AsistenciaProfesor } from '../pages/asistenciaProfesor/asistenciaProfesor';
import { AsistenciaAlumno } from '../pages/asistenciaAlumno/asistenciaAlumno';
import { Idioma } from '../pages/idioma/idioma';
import { Readme } from '../pages/readme/readme';
import { Localizacion } from '../pages/localizacion/localizacion';

import { PersonasService } from './personas.service';
import { AuthService } from './auth-service';

import { PersonasPage } from '../pages/personas/personas';
import { Archivos } from '../pages/archivos/archivos';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

//PARA FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { PersonasamPage } from '../pages/personasam/personasam';
 import {FIREBASE_CONFIG} from './app.firebase.config';		
//Encuesta
import { Encuesta } from '../pages/encuesta/encuesta';
import { Graficos } from '../pages/graficos/graficos';
import { ServEncuesta} from '../providers/serv-encuesta';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegistroPage,
    Materias,
    MateriasPrincipal,


    
    PrincipalPage,
    PersonasPage,
    PersonasamPage,
    AboutPage,

    AsistenciaAdministrativo,
    AsistenciaProfesor,
    AsistenciaAlumno,
    Archivos,
    Idioma,
    Localizacion,

    //Encuesta y graficos
    Encuesta,
    Graficos,
    Readme
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule,// imports firebase/auth, only needed for auth features
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegistroPage,
    Materias,
    MateriasPrincipal,

    
    PrincipalPage,
    PersonasPage,
    PersonasamPage,
    AboutPage,

    AsistenciaAdministrativo,
    AsistenciaProfesor,
    AsistenciaAlumno,
    Encuesta,
    Graficos,
    Archivos,
    Idioma,
    Localizacion,
    Readme
  ],
  providers: [
    PersonasService,
    StatusBar,
    Camera,
    SplashScreen,
    BarcodeScanner,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabaseModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Vibration,
    NativeAudio,
    DeviceMotion,
    Device,
    ServEncuesta,
    File,
    GooglePlus,
    GoogleMaps,
    Globalization
  ]
})
export class AppModule {}
