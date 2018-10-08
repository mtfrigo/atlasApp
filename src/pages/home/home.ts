import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JsonsProvider } from '../../providers/jsons/jsons';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private list_uf : Object = [];
  private pt_br : Object = [];
  private ready_pt_br : boolean = false;
  private uf :  number = 0;
  private vrv:  number = 1;
  private eixo: number = 0;
  constructor(public navCtrl: NavController, private jsonsProvider : JsonsProvider) {

  }

  ngOnInit(){
    this.jsonsProvider.getUfJson()
        .subscribe( d => {
          this.list_uf = d;
        })

    this.jsonsProvider.getPTBR()
      .subscribe( d => {
        this.pt_br = d;
        this.ready_pt_br = true;
      })

  }


}

