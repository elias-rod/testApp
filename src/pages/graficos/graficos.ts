import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import{ServEncuesta} from '../../providers/serv-encuesta';//AGREGO SERVICIO
import { PrincipalPage } from '../principal/principal';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the Graficos page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-graficos',
  templateUrl: 'graficos.html',
    providers :[ServEncuesta]
})
export class Graficos {

    @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('doughnutCanvas2') doughnutCanvas2;
    //@ViewChild('lineCanvas') lineCanvas;

    barChart: any;
    doughnutChart: any;
    doughnutChart2: any;

     public cantB = 0;
   public cantRe = 0;;
   public cantM = 0;;
   public cantSi = 0;;
   public cantNo = 0;;
   public cantSisi = 0;;
   public cantNono = 0;;
   listadoPersonas:string[];

    constructor(public navCtrl: NavController,private ServEncuesta:ServEncuesta,
  public translate: TranslateService) {

    }

    ionViewDidLoad() {
        this.ServEncuesta.TraerMaterias()
      .then(data => {
          
          data.forEach(item => {
        console.info(item.respuesta1);
        console.log(item);
    if(item.respuesta1 == "Buena" && item.pregunta1 == "pregunta1")
    {
      this.cantB += 1;
      console.log("buena",this.cantB);
      
    }
    if(item.respuesta1 == "Regular" && item.pregunta1 == "pregunta1")
    {
      this.cantRe += 1;
      console.log("regular",this.cantRe);
      
    }
    if(item.respuesta1 == "Mala" && item.pregunta1 == "pregunta1")
    {
      this.cantM += 1;
      console.log("mala",this.cantM);
      
    }
    if(item.respuesta2 == "Si" && item.pregunta2 == "pregunta2")
    {
      this.cantSi += 1;
      console.log("si",this.cantSi);
      
    }
    if(item.respuesta2 == "No" && item.pregunta2 == "pregunta2")
    {
      this.cantNo += 1;
      console.log("no",this.cantNo);
      
    }
    if(item.respuesta3 == "Sisi" && item.pregunta3 == "pregunta3")
    {
      this.cantSisi += 1;
      console.log("sisi",this.cantSisi);
      
    }
    if(item.respuesta3 == "Nono" && item.pregunta3 == "pregunta3")
    {
      this.cantNono += 1;
      console.log("nono",this.cantNono);
      
    }
      });
       
    this.translate.get(["Buena","Regular","Mala","Me Gustaria","No me gustaria"])
    .subscribe(
      translatedText => {
        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: [translatedText["Buena"], translatedText["Regular"], translatedText["Mala"]],
                datasets: [{
                    label: '# of Votes',
                    data: [this.cantB, this.cantRe, this.cantM],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }

        });

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: [translatedText["Buena"], translatedText["Mala"]],
                datasets: [{
                    label: '# of Votes',
                    data: [this.cantSi,this.cantNo],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                    
                    ]
                }]
            }

        });

   this.doughnutChart2 = new Chart(this.doughnutCanvas2.nativeElement, {

            type: 'doughnut',
            data: {
                labels: [translatedText["Me Gustaria"], translatedText["No me gustaria"]],
                datasets: [{
                    label: '',
                    data: [this.cantSisi, this.cantNono],
                    backgroundColor: [
                        'rgba(75,112,112,0.4)',
                        'rgba(54, 162, 235, 0.2)',
                        
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                    
                    ]
                }]
            }

        });
      }
    );


    })
   
 }


    Volver()
    {
        this.navCtrl.setRoot(PrincipalPage);

    }



}
