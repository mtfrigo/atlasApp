import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JsonsProvider } from '../../providers/jsons/jsons';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnChanges{
  private list_uf : Object = [];
  private pt_br : Object = [];
  private anos : number[];
  private cads : any[];
  private ready_pt_br : boolean = false;
  private parameters = {
    'uf': 0,
    'var': 1,
    'eixo': 0,
    'ano': 0,
    'cad': 0,
    'deg': 0,
    'subdeg': 0,
    'chg': 0,
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
        console.log(d['select']['cad'])
        this.cads = d['select']['cad'];
      })

    this.jsonsProvider.getAnos(this.parameters.eixo)
      .subscribe(d => {
        this.anos = d;
        this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
      })

  }

  ngOnChanges(changes: SimpleChanges){
    const parameters = changes.parameters;
    console.log(parameters)
  }

  update(event){
    this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
    this.parameters.uf  = 0;
  }

  getQuery(parameters : Object){
    return Object.keys(parameters)
                 .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
                  })
                  .join('&');
  }
}

