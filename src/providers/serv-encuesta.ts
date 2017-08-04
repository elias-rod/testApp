import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
/*
  Generated class for the ServEncuestaProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ServEncuesta {

 route : string = "http://www.nggroup.esy.es/api/index.php/";

 data:Array<Object>;
  constructor(public http: Http) {
    console.log('Hello ServMaterias Provider');
  }

  AgregarMateria(formData){

     var body = {"pregunta1" : formData[0].pregunta1,
                "respuesta1" : formData[0].respuesta1,
                "pregunta2" : formData[0].pregunta2,
                "respuesta2" : formData[0].respuesta2,
                "pregunta3" : formData[0].pregunta3,
                "respuesta3" : formData[0].respuesta3,
                }

  return this.http.post(this.route + "encuesta/agregar", body).toPromise();
}


TraerMaterias(){
    return this.http.get(this.route + "encuesta/obtenerTodas").toPromise().then(data => data.json());
  }
}