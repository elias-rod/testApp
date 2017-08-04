import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
 
export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;
  access: number;
  infoUser:string[];

  route : string = "http://nggroup.esy.es/api/index.php/";//servidor online

  constructor(private http : Http) { }

  VerificarUsuario(email, pass){

    let requestOptions = new RequestOptions({
      params : {
        "email" : email,
        "pass" : pass
      }
    });
    return this.http.get(this.route + "persona/VerificarUsuario", requestOptions).toPromise().then(data => data.json());

  } 
  
  
  
 public login(email,password) {
      this.access = 0;

    if (email === null || password === null) {
      return Observable.throw("Please insert credentials");
    }
    else {

      return Observable.create(observer => {
        this.VerificarUsuario(email, password).then(data => {
          this.infoUser=data;

          if(this.infoUser.length<1 )
            {
                     this.access = 2;
                    return;
               }
           else
               {
                   this.access = 1;
                   this.currentUser = new User(email, password);
                }
          this.access = data;
        });
        observer.next(this.access);
        observer.complete();
      });
    }
  }
 

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}