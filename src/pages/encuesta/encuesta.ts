import { Component } from '@angular/core';
import { IonicPage, NavController,NavParams,ToastController } from 'ionic-angular';
import{ServEncuesta} from '../../providers/serv-encuesta';//AGREGO SERVICIO
import { PrincipalPage } from '../principal/principal';
import { Storage } from '@ionic/storage';//STORAGE FOR IONIC

import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';

import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the EncuestaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-encuesta',
  templateUrl: 'encuesta.html',
  providers :[ServEncuesta]
})
export class Encuesta {

   Preg1Rb: string = '';
  Preg2Rb: string = '';
  Preg3Rb: string ='';
 nombre:string;
  idusuario:number;
  imagen:string;
  rol:string;
   
  public pregunta1;
  public pregunta2;
  public pregunta3;
  mensajeErrorFormAlta : string;

  constructor(public navCtrl: NavController,public toastCtrl: ToastController, private vibration: Vibration,
  private nativeAudio: NativeAudio,public navParams: NavParams,
  private storage: Storage,private ServEncuesta:ServEncuesta,
  public translate: TranslateService){
    translate.get(["Que te parecio la Aplicacion","Te gusta la interfaz de la Aplicacion", "Te gustaria que salga una nueva version"])
    .subscribe(
      translatedText => {
        this.pregunta1 = translatedText["Que te parecio la Aplicacion"];
        this.pregunta2 = translatedText["Te gusta la interfaz de la Aplicacion"];
        this.pregunta3 = translatedText["Te gustaria que salga una nueva version"];
      }
    );
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaPage');
     this.storage.get('userInfo').then((val) => {
       console.info(val.imagen)
       console.info(val.nombre)
      this.idusuario=val.idUsuario;      
      this.imagen=val.imagen;
      this.nombre=val.nombre;        
      this.rol=val.idRol;
    })
  }


Cancelar()
{
    this.navCtrl.setRoot(PrincipalPage);

}

  Guardar()
  {
    this.translate.get(['Encuesta guardada', ])
    .subscribe(
      translatedText => {
        var array = [{
          "pregunta1": "pregunta1", "respuesta1": this.Preg1Rb,
          "pregunta2":"pregunta2", "respuesta2": this.Preg2Rb,
          "pregunta3":"pregunta3", "respuesta3": this.Preg3Rb
        }];
        
        this.ServEncuesta.AgregarMateria(array).then(
        data => {
          if (data['_body'] == "true") {
    
          this.vibration.vibrate(500);
            this.nativeAudio.play('yay');
          let toast = this.toastCtrl.create({
                  message: translatedText['Encuesta guardada'],
              duration: 2000
            });       
          toast.present();
            setTimeout(() => {
              this.navCtrl.setRoot(PrincipalPage);
            }, 1500);
            console.log("Modificado");
          } else {
            console.log('ERROR:no modificado ');
          }
        })
        .catch(error => {
          console.log('ERROR: ' + error);
        });
      }
    );
         

            
   }

  

}
