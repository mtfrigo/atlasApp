import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

/*
  Generated class for the DadosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DadosProvider {

  globalData: any;

  constructor(public http: HttpClient) {

    this.globalData = {};

    this.globalData['barras'] = {};
    this.globalData['barras']['valor'] = 0;
    this.globalData['barras']['percentual'] = 0;

    this.globalData['treemap'] = {};
    this.globalData['treemap']['valor'] = 0;
    this.globalData['treemap']['percentual'] = 1;

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

  getPrepos(uf){
    uf = uf.toUpperCase()
    var prepos = {
        "BRASIL": "DO",
        "ACRE":"DO",
        "ALAGOAS":"DE",
        "AMAPÁ":"DO",
        "AMAZONAS":"DO",
        "BAHIA":"DA",
        "CEARÁ":"DO",
        "DISTRITO FEDERAL":"DO",
        "ESPÍRITO SANTO":"DO",
        "GOIÁS":"DE",
        "MARANHÃO":"DO",
        "MATO GROSSO":"DE",
        "MATO GROSSO DO SUL":"DE",
        "MINAS GERAIS":"DE",
        "PARÁ":"DO",
        "PARAÍBA":"DA",
        "PARANÁ":"DO",
        "PERNAMBUCO":"DE",
        "PIAUÍ":"DO",
        "RIO DE JANEIRO":"DO",
        "RIO GRANDE DO NORTE":"DO",
        "RIO GRANDE DO SUL":"DO",
        "RONDÔNIA":"DE",
        "RORAIMA":"DE",
        "SANTA CATARINA":"DE",
        "SÃO PAULO":"DE",
        "SERGIPE":"DE",
        "TOCANTINS": "DO",
        "EUROPA": "DA",
        "MUNDO": "DO",
        "ÁFRICA": "DA",
        "AMÉRICA DO SUL": "DA",
        "AMÉRICA DO NORTE": "DA",
        "OCEANIA": "DA",
        "ÁSIA": "DA"
    }

    return prepos[uf];
  }

  getUFName(idUF){

    idUF = parseInt(idUF);

    switch(idUF){
        case 0: return "Brasil";
        case 11: return "Rondônia";
        case 12: return "Acre";
        case 13: return "Amazonas";
        case 14: return "Roraima";
        case 15: return "Pará";
        case 16: return "Amapá";
        case 17: return "Tocantins";
        case 21: return "Maranhão";
        case 22: return "Piauí";
        case 23: return "Ceará";
        case 24: return "Rio Grande do Norte";
        case 25: return "Paraíba";
        case 26: return "Pernambuco";
        case 27: return "Alagoas";
        case 28: return "Sergipe";
        case 29: return "Bahia";
        case 31: return "Minas Gerais";
        case 32: return "Espírito Santo";
        case 33: return "Rio de Janeiro";
        case 35: return "São Paulo";
        case 41: return "Paraná";
        case 42: return "Santa Catarina";
        case 43: return "Rio Grande do Sul";
        case 50: return "Mato Grosso do Sul";
        case 51: return "Mato Grosso";
        case 52: return "Goiás";
        case 53: return "Distrito Federal";
    }
  }

  getCadName(idCad){

    idCad = parseInt(idCad);

    switch(idCad){
        case 0: return "Todos";
        case 1: return "Arquitetura e Design";
        case 2: return "Artes Cênicas e Espetáculos";
        case 3: return "Audiovisual";
        case 4: return "Cultura Digital";
        case 5: return "Editorial";
        case 6: return "Educação e Criação em Artes";
        case 7: return "Entretenimento";
        case 8: return "Música";
        case 9: return "Patrimônio";
        case 10: return "Publicidade";
    }
  }

  getPorteName(idPorte){

    idPorte = parseInt(idPorte);

    switch(idPorte){
        case 9: return "PORTE MICRO";
        case 10: return "PORTE PEQUENO";
        case 11: return "PORTE MÉDIO";
        case 12: return "PORTE GRANDE";
    }
  }

  getFinalDesc(i, text, parameters){

    var deg_text = "";

    var cad_text = this.getCadName(parameters.cad).toUpperCase();

    var uf_text = this.getUFName(parameters.uf).toUpperCase();
    var nomeestado = this.getPrepos(uf_text)+' '+uf_text;
    if(parameters.eixo == 0)
      deg_text = "DE"+' '+ this.getPorteName(parameters.deg);

    return text.replace('[uf]', nomeestado).replace('[cad]', cad_text).replace('[deg]', deg_text);
  }

}
