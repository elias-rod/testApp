import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

import { PrincipalPage } from '../principal/principal';
/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  slides:{};
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {

        this.slides = [
      {
        title: "Lucas Rodriguez",
        image: "https://avatars2.githubusercontent.com/u/19439749?v=3&s=460",
        description: "<a href='https://github.com/lucasdrodriguez'>GitHub</a>",
      },
      {
        title: "Julian Reinoso",
        image: "https://avatars3.githubusercontent.com/u/15034867?v=3&s=460",
        description: "<a href='https://github.com/Julianreinoso94'>GitHub</a>",
        
      },
      {
        title: "Elias Rodriguez",
        image: "https://avatars3.githubusercontent.com/u/12984787?v=3&s=460",        
        description: "<a href='https://github.com/virtualgithub'>GitHub</a>",
        
      },
      {
        title: "Pablo De Cecco",
        image: "https://avatars1.githubusercontent.com/u/17866484?v=3&s=460",        
        description: "<a href='https://github.com/dececco'>GitHub</a>",
        
      }
    ];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }
  back() {
    this.navCtrl.setRoot(PrincipalPage);
  }
}
