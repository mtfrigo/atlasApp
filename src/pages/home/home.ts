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
  private anos : number[];
  private ready_pt_br : boolean = false;
  private parameters = {
    'uf': 0, 
    'var': 1, 
    'eixo': 0,
    'ano': 0,
    'slc': 0
  };

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

    this.jsonsProvider.getAnos(this.parameters.eixo)
      .subscribe(d => {
        this.anos = d;
        this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
      })

  }

  update(event){
    this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
    this.parameters.uf  = 0;
  }
}

