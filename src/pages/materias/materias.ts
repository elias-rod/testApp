import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ActionSheetController,AlertController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';//FORMBUILDER CREA FORMS, FORMGROUP DEFINE UN FORMULARIO Y VALIDATORS CONTIENE VALIDACIONES PREDISEÑADAS
import{ServMaterias} from '../../providers/serv-materias';//AGREGO SERVICIO
import {MateriasPrincipal} from '../materias-principal/materias-principal';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-materias',
  templateUrl: 'materias.html',
   providers :[ServMaterias]
})
export class Materias {
  formVisible = false;
   datosTraidos;
   datotraido;
   modifica: boolean = true;
   estado: string;
  nombreMateria: string = '';
  numDia: string = '';
  numAula: string = '';
  division: string = '';
  Cuatrimestre: string = '';
  button: string ='alta';
  idMateria: number;
  img:string;

   mensajeErrorFormAlta : string;

   formAgregar : FormGroup;
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,private ServMaterias:ServMaterias, public platform: Platform,public navParams: NavParams,public formBuilder: FormBuilder,
  public translate: TranslateService)
  {
    this.estado = this.navParams.get("estado");
   this.idMateria = this.navParams.get("idMateria");
    this.TraerMaterias();
    //UTILIZACIÓN DE CONSTRUCTOR DE FORMULARIOS CON VALIDACIONES
       this.formAgregar = formBuilder.group({
           nombreMateria: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^[a-zA-Z]+$'), Validators.required])],
           numDia: ['', Validators.compose([Validators.maxLength(1), Validators.pattern('^[0-9]*$'), Validators.required])],
           numAula: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('^[0-9]*$'), Validators.required])],
            division: ['', Validators.compose([Validators.maxLength(2) , Validators.required])],
           Cuatrimestre: ['', Validators.compose([Validators.maxLength(2), Validators.required])]
       });
  }

  back(){
   this.navCtrl.setRoot(MateriasPrincipal);
 }

 ionViewDidLoad() {
   if (this.estado != 'Alta') {
     this.modifica = true;
     console.log(this.idMateria);
    //  this.idMateria = this.navParams.get("idMateria");
     this.ServMaterias.ObtenerMateria(this.idMateria).then(
         data => {
           if (typeof data[0] != 'undefined')
           {
             this.nombreMateria = data[0].nombre;
             this.numDia = data[0].idDia;
             this.numAula = data[0].idAula;
             this.Cuatrimestre = data[0].cuatrimestre;
             this.division = data[0].division
           }
                 })
                 .catch(error => {
                   console.log('ERROR: ' + error);
                 });
               }
               else
               {
      this.modifica = false;
    }

             }

  presentActionSheet() {
    this.translate.get(['¿Qué desea realizar?','Eliminar','Modificar','Cancelar'])
    .subscribe(
      translatedText => {
let actionSheet = this.actionSheetCtrl.create({
      title: translatedText['¿Qué desea realizar?'],
      buttons: [
        {
          text: translatedText['Eliminar'],
          role: 'eliminar',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.delete();
          }
        }, {
          text: translatedText['Modificar'],
          icon: !this.platform.is('ios') ? 'md-create' : null,
          handler: () => {
            this.create();
          }
        }, {
          text: translatedText['Cancelar'],
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancelar',
          handler: () => {

          }
        }
      ]
    })
    actionSheet.present();
      }
    );
  }
  create() {
    console.info('create')
    this.modifica = false;
  }

  delete() {
    this.translate.get(['Eliminar','¿Desea eliminar la Materia?', 'Si'])
    .subscribe(
      translatedText => {
let alert = this.alertCtrl.create({
       title: translatedText['Eliminar'],
       message: translatedText['¿Desea eliminar la Materia?'],
       buttons: [
         {
           text: 'No',
           role: 'cancel',
           handler: () => {

           }
         },
         {
           text: translatedText['Si'],
           handler: () => {
             this.ServMaterias.BorrarMateria(this.idMateria)
               .then(data=>{console.log(data); this.navCtrl.setRoot(MateriasPrincipal); })
               .catch(error => {
                 console.log('ERROR: ' + error);
               });
           }
         }
       ]
     });
     alert.present();
      }
    );
     
   }

 guardar() {
   if(this.formAgregar.valid){
     //CREACION DE OBJETO FORMDATA QUE CONTENDRA LA INFO DEL FORMULARIO
     var formData = new FormData();
           //AGREGADO DE PARES CLAVE/VALOR AL FORMDATA
     formData.append('idDia', this.formAgregar.value.numDia);
     formData.append('idAula', this.formAgregar.value.numAula);
     formData.append('nombre', this.formAgregar.value.nombreMateria);
     formData.append('cuatrimestre', this.formAgregar.value.Cuatrimestre);
     formData.append('division', this.formAgregar.value.division);

       if (this.estado == 'Alta') {
     this.ServMaterias.AgregarMateria(formData)
       .then((data) => {
         //SI HAY ALGUN MENSAJE DE ERROR, AVISAR E IMPEDIR
         if(data.json() != null){

           this.mensajeErrorFormAlta = data.json();
           //return;
           this.navCtrl.setRoot(MateriasPrincipal);
             }
             else
             {
                this.navCtrl.setRoot(MateriasPrincipal);
             }
           })
           .catch(error => {
            console.log('ERROR: ' + error);
          });
        } else {
          var array = [{
               "nombreMateria": this.nombreMateria, "numDia": this.numDia, "numAula": this.numAula, "division": this.division,"cuatrimestre":this.Cuatrimestre,
                "idMateria": this.idMateria
             }];
             this.ServMaterias.Modificar(array).then(
              data => {
                if (data['_body'] == "true") {
                  //this.navCtrl.setRoot(PersonasPage);
                  //this.toastOk('Modificado');
                  this.navCtrl.setRoot(MateriasPrincipal);
                  console.log("Modificado");
                } else {
                  console.log('ERROR:no modificado ');
                }
              })
              .catch(error => {
                console.log('ERROR: ' + error);
              });
        }
      }
    }





  TraerMaterias(){
    this.ServMaterias.TraerMaterias()
      .then(data => {
        this.datosTraidos = data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  MostrarFormulario() {
    this.formVisible = !this.formVisible;
    //this.formAgregar.reset();
  }



  EliminarMateria(idMateria) {
  this.ServMaterias.BorrarMateria(idMateria)
    .then(() => this.TraerMaterias());
}


/*  this.materia={
      aula:this.datotraido.idAula,
      dia:this.datotraido.idDia,
      nombre:this.datotraido.nombre,
      cuatrimestre:this.datotraido.cuatrimestre
      //division:"datotraidodivision"
    };*/

  //  var formData = new FormData();
          //AGREGADO DE PARES CLAVE/VALOR AL FORMDATA
  //  document.getElementById("nombre").value="idMateria";
/*
  this.MostrarFormulario();
//this.ServMaterias.ModificarMateria(idMateria)
//  .then(() => this.TraerMaterias());
}*/

/*  guardar(){
    var array = [{
         "nombreMateria": this.nombreMateria, "numDia": this.numDia, "numAula": this.numAula, "division": this.division,"cuatrimestre":this.cuatrimestre,
          "idMateria": this.idMateria
       }];
       this.ServMaterias.Modificar(array).then(
        data => {
          if (data['_body'] == "true") {
            //this.navCtrl.setRoot(PersonasPage);
            //this.toastOk('Modificado');
            console.log("Modificado");
          } else {
            console.log('ERROR:no modificado ');
          }
        })
        .catch(error => {
          console.log('ERROR: ' + error);
        });
        this.formAgregar.reset();
        this.TraerMaterias();
        this.MostrarFormulario();

    console.log("inicio");*/
    //VERIFICACION
/*    if ((<HTMLInputElement>document.getElementById('foto')).files[0] == undefined) {
      this.mensajeErrorFormAlta = 'La foto es obligatoria.';
      return;
    }

    if (this.formAgregar.get('nombrePersona').invalid) {
      this.mensajeErrorFormAlta = 'nombre INVALIDO';
      return;

    }

    if(this.formAgregar.get('apellidoPersona').invalid){
      this.mensajeErrorFormAlta = 'apellido INVALIDO';
      return;
    }

    if(this.formAgregar.get('dniPersona').invalid){
      this.mensajeErrorFormAlta = 'DNI INVALIDO';
      return;
    }
    //VERIFICACION
    if(this.formAgregar.get('passPersona').invalid){
      this.mensajeErrorFormAlta = 'CONTRASEÑA INVALIDA';
      return;
    }*/
  //  if (this.button== 'agregar')
  //  {
    /*if(this.formAgregar.valid){
      //CREACION DE OBJETO FORMDATA QUE CONTENDRA LA INFO DEL FORMULARIO
      var formData = new FormData();
            //AGREGADO DE PARES CLAVE/VALOR AL FORMDATA
      formData.append('idDia', this.formAgregar.value.numDia);
      formData.append('idAula', this.formAgregar.value.numAula);
      formData.append('nombre', this.formAgregar.value.nombreMateria);
      formData.append('cuatrimestre', this.formAgregar.value.Cuatrimestre);
      formData.append('division', this.formAgregar.value.division);
      this.ServMaterias.AgregarMateria(formData)
        .then((data) => {
          //SI HAY ALGUN MENSAJE DE ERROR, AVISAR E IMPEDIR
          if(data.json() != null){
            //this.mensajeErrorFormAlta = data.json();
            //return;
          }
          this.formAgregar.reset();
          this.TraerMaterias();
          this.MostrarFormulario();
        });
    }*/

  /*  else
    {
      if(this.formAgregar.valid){
        //CREACION DE OBJETO FORMDATA QUE CONTENDRA LA INFO DEL FORMULARIO
        var formData = new FormData();
              //AGREGADO DE PARES CLAVE/VALOR AL FORMDATA
        formData.append('idDia', this.formAgregar.value.numDia);
        formData.append('idAula', this.formAgregar.value.numAula);
        formData.append('nombre', this.formAgregar.value.nombreMateria);
        formData.append('cuatrimestre', this.formAgregar.value.Cuatrimestre);
        formData.append('division', this.formAgregar.value.division);
        this.ServMaterias.ModificarMateria(formData)
          .then((data) => {
            //SI HAY ALGUN MENSAJE DE ERROR, AVISAR E IMPEDIR
            if(data.json() != null){
              //this.mensajeErrorFormAlta = data.json();
              //return;
            }
            this.formAgregar.reset();
            this.TraerMaterias();
            this.MostrarFormulario();
          });
    }

    }
  }
}//fin metodo*/
}
