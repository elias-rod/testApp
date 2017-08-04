import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';


import { TranslateService } from '@ngx-translate/core';

import { Globalization } from '@ionic-native/globalization';

@Component({
  selector: 'page-readme',
  templateUrl: 'readme.html'
})


export class Readme {
  constructor(public navCtrl: NavController,
  public loadingCtrl: LoadingController) {}
}