import { Component, Input, OnChanges } from '@angular/core';
import { NavController } from 'ionic-angular';

import { JsonsProvider } from '../../providers/jsons/jsons';

import * as d3 from "d3";
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";

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

  @Input() parameters : any[];
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

  constructor(public navCtrl: NavController, private dadosProvider: DadosProvider, private jsonsProvider: JsonsProvider) {
    this.text = 'Hello World';
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

    this.valor = this.dadosProvider.getGlobalData().barras.valor;
    this.percentual = this.dadosProvider.getGlobalData().barras.percentual;


    for(var i = 0; i < this.descricoes[this.parameters.eixo][this.parameters.var].length; i++){
      if(this.descricoes[this.parameters.eixo][this.parameters.var][i][this.desc_key] != "")
        this.desc_array.push(this.descricoes[this.parameters.eixo][this.parameters.var][i][this.desc_key])
    }

    console.log(this.globalData);

  }

}
