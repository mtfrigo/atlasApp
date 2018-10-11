import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DadosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DadosProvider {

  globalData: Object;

  constructor(public http: HttpClient) {

    this.globalData = {};

    this.globalData['barras'] = {};
    this.globalData['barras']['valor'] = 0;
    this.globalData['barras']['percentual'] = 0;

    this.globalData['treemap'] = {};
    this.globalData['treemap']['valor'] = 0;
    this.globalData['treemap']['percentual'] = 0;

    this.globalData['linhas'] = {};
    this.globalData['linhas']['valor'] = 0;
    this.globalData['linhas']['percentual'] = 0;

    this.globalData['mapa'] = {};
    this.globalData['mapa']['valor'] = 0;
    this.globalData['mapa']['percentual'] = 0;


  }

  getDescriptionKey(parameters){

    var key = "";

    if(parameters.uf != 0) key = key + "u";
    if(parameters.cad != 0) key = key + "s";
    if(parameters.deg != 0) key = key + "d";

    return key;

  }

  setGlobalData(view, valor, percentual){
    this.globalData[view]['valor'] = valor;
    this.globalData[view]['percentual'] = percentual;
  }

  getGlobalData(){
    return this.globalData;
  }

}
