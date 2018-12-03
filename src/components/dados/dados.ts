import { Component, Input, ChangeDetectorRef } from '@angular/core';
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
  @Input() pt_br :  any;

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

  total_setor: any;
  total_deg: any;
  total_brasil: any;
  total_estado: any;

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
        this.parameters.cad = Number(this.parameters.cad)
        this.parameters.uf = Number(this.parameters.uf)
        this.dadosProvider.getTotalSetor(this.parameters)
          .subscribe(d=>{
            this.total_setor = d;
            this.dadosProvider.getTotalDeg(this.parameters)
              .subscribe(d=>{

                this.total_deg = d;

                this.dadosProvider.getTotalBrasil(this.parameters)
                  .subscribe(d=>{

                    this.total_brasil = d;

                    this.dadosProvider.getTotalEstado(this.parameters)
                      .subscribe(d=>{
                        this.total_estado = d;
                        this.getData();

                    })
                })
            })
        })
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
    var percentual : number = 1;

    this.desc_array = [];

    var valor = this.dadosProvider.globalData['barras'].valor;
    var total = this.dadosProvider.globalData['treemap'].total;
    var uos1 = this.dadosProvider.globalData['barras'].uos1;
    var uos2 = this.dadosProvider.globalData['barras'].uos2;
    var uos3 = this.dadosProvider.globalData['barras'].uos3;

    if(this.parameters.eixo == 3){
      percentual = this.parameters.mundo == 1 ? this.dadosProvider.globalData['barras'].percentual : this.dadosProvider.globalData['mapa-mundi'].percentual;

    } else {
      percentual = this.parameters.cad == '0' ? this.dadosProvider.globalData['barras'].percentual : this.dadosProvider.globalData['treemap'].percentual;
    }

    if(this.parameters.eixo == 2 && (this.parameters.var == 18 || this.parameters.var == 19)) percentual = this.dadosProvider.globalData['barras'].percentual;

    let valores = {valor: valor, percentual: percentual, total: total, uos1: uos1, uos2: uos2, uos3: uos3}

    var descByEixo;

    switch(this.parameters.eixo){
      case 0: descByEixo = this.descricoes[this.parameters.eixo][this.parameters.var]; break;
      case 1: descByEixo = this.descricoes[this.parameters.eixo][this.parameters.var][this.parameters.slc]; break;
      case 2: descByEixo = this.descricoes[this.parameters.eixo][this.parameters.var][this.parameters.slc]; break;
      case 3: descByEixo = this.descricoes[this.parameters.eixo][this.parameters.var][this.parameters.mundo]; break;
    }

    for(var i = 0; i < descByEixo.length; i++){

      if(descByEixo[i][this.desc_key] != ""){

        var desc = this.dadosProvider.getFinalDesc(i, descByEixo[i][this.desc_key], this.parameters);

        var formattedData;

        switch(i){
          case 0: formattedData = this.formatDescValue(i, valores);
            break;
          case 1: formattedData = this.formatDescValue(i, valores);
            break;
          case 2: formattedData = this.formatDescValue(i, valores);
            break;
        }

        this.desc_array.push({desc: desc, valor: formattedData});

      }

    }
  }

  formatDescValue(box, valores)
  {

    let parameters = this.parameters;

    function filterByID(obj) {
      if ('id' in obj && !isNaN(obj.id) && obj.id == parameters.var)
        return true;
    }
    var descVar = this.pt_br.var[this.parameters.eixo].filter(filterByID);

    var prefix = descVar[0]['prefixo_valor'];
    var suffix = descVar[0]['sufixo_valor'];

    if(this.parameters.eixo == 0)
    {
      switch(box){
        case 0:
              if(this.parameters.var == 2 || this.parameters.var == 3 || this.parameters.var == 9)
                return this.formatDecimal(valores.valor, 5)+"%";
              else if(this.dadosProvider.isIHHorC4(this.parameters))
                return this.formatNumber(valores.uos1);
              else
                return prefix+this.formatNumber(valores.valor)+suffix;
        case 1:

          if(this.treemapRelativeValue() && valores.total)
            return this.formatDecimal(valores.valor/valores.total, 2)+"%";
          else if(this.dadosProvider.isIHHorC4(this.parameters))
            return this.formatNumber(valores.uos2);
          else if(this.parameters.var == 5 && this.parameters.cad != 0 && this.parameters.uf != 0)
            return this.formatDecimal(valores.valor/this.total_deg[this.parameters.ano], 2)+"%"
          else
            if(this.parameters.deg != 0)
            {
              if(this.parameters.uf == 0)
                return this.formatDecimal(valores.valor/this.total_brasil[this.parameters.ano], 2)+"%"

              else
                return this.formatDecimal(valores.valor/this.total_deg[this.parameters.ano], 2)+"%"

            }
            else
              return this.formatDecimal(valores.percentual, 2)+"%";


        case 2:
          return this.formatDecimal(valores.valor/this.total_setor[this.parameters.ano], 2)+"%";
      }
    }
    else if(this.parameters.eixo == 1)
    {
      switch(box){
        case 0:
          if(this.parameters.var == 2)
            return this.formatDecimal(valores.valor, 5)+"%";
          else if(this.dadosProvider.isIHHorC4(this.parameters))
              return this.formatNumber(valores.uos1);
          else
            return prefix+this.formatNumber(valores.valor)+suffix;
        case 1:
          if(this.treemapRelativeValue() && valores.total)
            return this.formatDecimal(valores.valor/valores.total, 2)+"%";
          else if(this.dadosProvider.isIHHorC4(this.parameters))
            return this.formatNumber(valores.uos2);
          else if(this.parameters.cad != 0 && this.parameters.deg != 0 && valores.total)
            return this.formatDecimal(valores.valor/this.total_deg[this.parameters.ano], 2)+"%";
          else if(this.parameters['var'] == 7 && this.parameters.cad != 0 && this.parameters.deg == 0 && this.parameters.uf == 0)
            return this.formatDecimal(valores.valor/this.total_brasil[this.parameters.ano], 2)+"%";
          else if(this.parameters['var'] == 7 && this.parameters.ocp != 0 && this.parameters.deg != 0 && this.parameters.uf != 0)
            return this.formatDecimal(valores.valor/this.total_estado[this.parameters.ano], 2)+"%";
          else if(this.parameters.ocp == 3)
            return this.formatDecimal(valores.valor/this.total_brasil[this.parameters.ano], 2)+"%";
          else
            return this.formatDecimal(valores.percentual, 2)+"%";
        case 2:
          if(this.parameters.cad != 0 && this.parameters.deg != 0)
            return this.formatDecimal(valores.valor/this.total_estado[this.parameters.ano], 2)+"%";
          else
          return this.formatDecimal(valores.valor/this.total_brasil[this.parameters.ano], 2)+"%";


      }

    }
    else if(this.parameters.eixo == 2)
    {
      switch(box){
        case 0:
              if(this.parameters.var == 7)
                return this.formatDecimal(valores.valor/100, 2)+"%";
              else if(this.parameters.var == 8 || this.parameters.var == 9)
                return this.formatDecimal(valores.valor/100, 5);
              else if(this.dadosProvider.isIHHorC4(this.parameters))
                return this.formatNumber(valores.uos1);
              else
                return prefix+this.formatNumber(valores.valor)+suffix;
        case 1:

          if(this.parameters.var == 18)
            return "R$ " + this.formatNumber(valores.percentual);
          else if(this.parameters.var == 19)
            return this.formatNumber(valores.percentual);
          else if(this.dadosProvider.isIHHorC4(this.parameters))
            return this.formatNumber(valores.uos2);
          else if(this.treemapRelativeValue() && valores.total)
            return this.formatDecimal(valores.valor/valores.total, 2)+"%";
          else
            return this.formatDecimal(valores.percentual, 2)+"%";

        case 2:
          return this.formatDecimal(valores.valor/this.total_setor[this.parameters.ano], 2)+"%";
      }

    }
    else if(this.parameters.eixo == 3)
    {
      switch(box){
        case 0:
              if(this.parameters.var == 2 || this.parameters.var == 3)
                return this.formatDecimal(valores.valor/100, 5)+"%";
              else if(this.dadosProvider.isIHHorC4(this.parameters))
                return this.formatNumber(valores.uos1);
              else
                return prefix+this.formatNumber(valores.valor)+suffix;
        case 1:

          if(this.treemapRelativeValue() && valores.total)
            return this.formatDecimal(valores.valor/valores.total, 2)+"%";
          else if(this.parameters.var == 5)
            return this.formatNumber(valores.uos2);
          else if(this.parameters.var == 8)
            return this.formatNumber(valores.uos3);
          else if(this.dadosProvider.isIHHorC4(this.parameters))
            return this.formatNumber(valores.uos2);
          else
            return this.formatDecimal(valores.percentual, 2)+"%";


        case 2:
        if(this.parameters.var == 5)
          return this.formatNumber(valores.uos3);
        else if(this.parameters.var == 8)
          return this.formatNumber(valores.uos2);
        else
          return this.formatDecimal(valores.valor/this.total_setor[this.parameters.ano], 2)+"%";
      }
    }

  }

  treemapRelativeValue(){
    if(this.parameters.eixo == 0){
      if(this.parameters.var == 1 || this.parameters.var == 4 || this.parameters.var == 6 || this.parameters.var == 7 || this.parameters.var == 8){
        if(this.parameters.cad != 0 && this.parameters.uf != 0){
          return true;
        }
      }
    }
    else if(this.parameters.eixo == 1){
      if(this.parameters.var == 1 || this.parameters.var == 7){
        if(this.parameters.cad && this.parameters.uf != 0 && this.parameters.deg == 0){
          return true;
        }
      }
    }
    else if(this.parameters.eixo == 2){
          return true;
    }
    return false;
  }

  formatNumber(valor){

    if(valor == undefined) return 1;

    if(valor.toString().includes(".")){
      valor = valor.toFixed(2).toString().replace(".",",");
    }

    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  }

  formatDecimal(valor, casas)
  {
    valor = valor * 100;
    let newValor = valor.toFixed(casas);

    let inteiro = this.formatNumber(newValor.split('.')[0]);
    let decimal =  newValor.split('.')[1];

    while(decimal == 0 && casas < 5)
    {
      casas++;

      newValor = valor.toFixed(casas);
      decimal =  newValor.split('.')[1];
    }
    casas++;
    newValor = valor.toFixed(casas);
    decimal =  newValor.split('.')[1];

    for (var i = decimal.length-1; i >= 0; i--) {
      if(decimal.charAt(i) == "0") decimal = decimal.slice(0, - 1)
      else break;
    }

    if(decimal.length > 0){
      valor = inteiro+","+decimal;
    }
    else{
      valor = inteiro;
    }

    return valor;
  }


}
