import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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
    {'name': "EMPREENDIMENTOS \n CULTURAIS", 'value': 0, 'color': '#D2D831'},
    {'name': "MERCADO DE \n TRABALHO", 'value': 1, 'color': '#8CC03D'},
    {'name': "POLÍTICAS \n PÚBLICAS", 'value': 2, 'color': '#139474'},
    {'name': "COMÉRCIO \n INTERNACIONAL", 'value': 3, 'color': '#043A2D'}
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  goToOtherPage(d: number){
    this.navCtrl.push(HomePage, {
      data: d
    });
  }

  getBackgroundImage(d){
    if(d.name == "Atlas"){
      return 'linear-gradient(to bottom right, #0A7482, #1C2E58)'
    }



    return null
  }
}
