import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SobrePage } from '../sobre/sobre';

/**
 * Generated class for the IndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {


  private eixos = [
    {'name': "Atlas", 'value': -1, 'color': "#ccc"},
    {'name': "EMPREENDIMENTOS \n CULTURAIS", 'value': 0, 'color': '#efc851', 'ioncolor': 'eixo1'},
    {'name': "MERCADO DE \n TRABALHO", 'value': 1, 'color': '#97BE13', 'ioncolor': 'eixo2'},
    {'name': "POLÍTICAS \n PÚBLICAS", 'value': 2, 'color': '#00916D', 'ioncolor': 'eixo3'},
    {'name': "COMÉRCIO \n INTERNACIONAL", 'value': 3, 'color': '#003F33', 'ioncolor': 'eixo4'}
  ]
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events) {

  }


  ionViewDidLoad() {
  }

  goToOtherPage(d){

    if(d.name == 'Atlas')
    {
      this.navCtrl.push(SobrePage, {
        data: d,
      });
    }
    else
    {

      this.navCtrl.push(HomePage, {
        data: d,
      });
    }
  }

  getBackgroundImage(d){
    if(d.name == "Atlas"){
      return 'linear-gradient(to bottom right, #0A7482, #1C2E58)'
    }



    return null
  }
}
