import { Component, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { JsonsProvider } from '../../providers/jsons/jsons';

import { DadosProvider } from '../../providers/dados/dados';
import { Observable } from 'rxjs';

/**
 * Generated class for the DadosComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-dados',
  templateUrl: 'dados.html'
})
export class DadosComponent {

  width  : number = window.innerWidth*0.9;
  height : number = window.innerHeight*0.5;

  @Input() parameters : any;
  @Input() globalData : Observable<any>;
  @Input() url : string;

  _data;

  text: string;

  counter = 0;

  descricoes: any = undefined;
  desc_key: string;
  primeira: string;
  segunda: string;
  terceira: string;

  valor: number;
  percentual: number;

  desc_array: any = [];

  constructor(public navCtrl: NavController,
              private dadosProvider: DadosProvider,
              private jsonsProvider: JsonsProvider,
              private cd: ChangeDetectorRef) {

  }

  ngOnInit() {

    this.globalData.subscribe(data => {
      this._data = data;
      this.cd.markForCheck();
      this.dadosProvider.globalData = data;

      this.jsonsProvider.getDescricoes()
      .subscribe(d=>{
        this.descricoes = d;
        this.getData();
      })
    })
  }

  ngOnChanges(){

    if(this.descricoes != undefined){
      this.getData();
    }
  }

  getData(){


    this.desc_key = this.dadosProvider.getDescriptionKey(this.parameters);

    this.desc_array = [];


    this.valor = this.dadosProvider.globalData['barras'].valor;
    this.percentual = this.dadosProvider.globalData['treemap'].percentual;

    for(var i = 0; i < this.descricoes[this.parameters.eixo][this.parameters.var].length; i++){

      if(this.descricoes[this.parameters.eixo][this.parameters.var][i][this.desc_key] != ""){

        var desc = this.dadosProvider.getFinalDesc(i, this.descricoes[this.parameters.eixo][this.parameters.var][i][this.desc_key], this.parameters);

        switch(i){
          case 0: this.desc_array.push({desc: desc, valor: this.valor});
            break;
          case 1: this.desc_array.push({desc: desc, valor: this.percentual});
            break;
          case 2: this.desc_array.push({desc: desc, valor: this.percentual});
            break;
        }

      }

    }
  }
}
