import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-select',
  templateUrl: 'modal-select.html',
})
export class ModalSelectPage {
  group = false;
  selected : number;
  items;
  teste_group;
  title = "";
  teste_desags = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl : ViewController) {
    
    this.items = this.navParams.get('items');
    this.group = this.navParams.get('group');
    this.title = this.navParams.get('title');
    this.selected = this.navParams.get('selected');

    
    if(this.group){
      this.teste_group = this.items.filter(d=>{
        if(d.group_name) return d;
      });

      for(let g in this.teste_group){
        this.teste_desags[g] =  this.items.filter(d=>{
          if(Math.floor(d.id/10) == this.teste_group[g].id) return d;
        });
      }
     
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalSelectPage');
  }

  isSelected(id : number){
    if(id == this.selected) return 'selected'
    else return '';
  }

  dismiss(data){
    this.viewCtrl.dismiss(data);
  }

}
