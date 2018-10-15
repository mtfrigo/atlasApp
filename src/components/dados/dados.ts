import { Component, Input, OnChanges } from '@angular/core';
import { NavController } from 'ionic-angular';

import { JsonsProvider } from '../../providers/jsons/jsons';

import { DadosProvider } from '../../providers/dados/dados';

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
  @Input() url : string;

  @Input() globalData : Object = [];

  text: string;

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
              private jsonsProvider: JsonsProvider) {

  }

  ngOnInit() {

    this.jsonsProvider.getDescricoes()
      .subscribe(d=>{
        this.descricoes = d;
        this.getData();
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

    var that = this;

    //TODO
    //PRECISA ATUALIZAR OS DADOS DEPOIS DAS VIEWS ATUALIZAREM A VARIÁVEL GLOBAL!
    setTimeout(function(){

      that.valor = that.dadosProvider.getGlobalData()['barras'].valor;
      that.percentual = that.dadosProvider.getGlobalData()['treemap'].percentual;

      for(var i = 0; i < that.descricoes[that.parameters.eixo][that.parameters.var].length; i++){

        if(that.descricoes[that.parameters.eixo][that.parameters.var][i][that.desc_key] != ""){

          var desc = that.dadosProvider.getFinalDesc(i, that.descricoes[that.parameters.eixo][that.parameters.var][i][that.desc_key], that.parameters);

          switch(i){
            case 0: that.desc_array.push({desc: desc, valor: that.valor});
              break;
            case 1: that.desc_array.push({desc: desc, valor: that.percentual});
              break;
            case 2: that.desc_array.push({desc: desc, valor: that.percentual});
              break;
          }

        }

      }
    }, 500);




  }



}
