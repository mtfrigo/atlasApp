import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the SelectAtlasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'atlas-select',
  templateUrl: 'select-atlas.html'
})
export class SelectAtlasComponent implements OnInit, OnChanges {
  @Input() current : number;
  @Input() items = [];
  @Input() group = false;
  @Input() title : string;
  @Output() parameter = new EventEmitter();

  selected_text : string = "";

  constructor(public modalCtrl : ModalController) {
  }

  ngOnInit(){
    this.selected_text = this.items.filter( d => {
      if(this.current == d.id) return d;
    })[0].name;
  }

  ngOnChanges(){
    this.selected_text = this.items.filter( d => {
      if(this.current == d.id) return d;
    })[0].name;
  }

  openModal(){
    let profileModal = this.modalCtrl.create('ModalSelectPage', {'items': this.items, 'group': this.group, 'title': this.title, 'selected': this.current});
    profileModal.present();

    profileModal.onDidDismiss(data => {
      if(data == null) {
        this.parameter.emit(null);
        return;
      }
      if(this.group){
        this.selected_text = data.item.name;
        this.parameter.emit({'group': data.group.id, 'item': data.item.id%10})
      } else {
        this.selected_text = data.name;
        this.parameter.emit(data.id)
      }
      
    });
  }

}
