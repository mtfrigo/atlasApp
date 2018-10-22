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
    {'name': "EMPREENDIMENTOS CULTURAIS", 'value': 0, 'color': '#d6d940'},
    {'name': "MERCADO DE TRABALHO", 'value': 1, 'color': '#89c445'},
    {'name': "POLÍTICAS PÚBLICAS", 'value': 2, 'color': '#299c76'},
    {'name': "COMÉRCIO INTERNACIONAL", 'value': 3, 'color': '#0e3b30'}
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  goToOtherPage(eixo: number){
    this.navCtrl.push(HomePage, {
      data: eixo
    });
  }
}
