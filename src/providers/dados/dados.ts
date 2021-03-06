import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { JsonsProvider } from '../jsons/jsons';

/*
  Generated class for the DadosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DadosProvider {

  globalData: any;
  pt_br : any;
  private totalSetorUrl : string = "http://www.ufrgs.br/obec/atlas/api/total_setor.php?";
  private totalDegUrl : string = "http://www.ufrgs.br/obec/atlas/api/total_desag.php?";
  private totalBrasilUrl : string = "http://www.ufrgs.br/obec/atlas/api/total_brasil.php?";
  private totalEstadoUrl : string = "http://www.ufrgs.br/obec/atlas/api/total_estado.php?";



  constructor(public http: HttpClient,
              private jsonsProvider: JsonsProvider) {

    this.globalData = {};

    this.globalData['barras'] = {};
    this.globalData['barras']['valor'] = 0;
    this.globalData['barras']['percentual'] = 0;

    this.globalData['treemap'] = {};
    this.globalData['treemap']['valor'] = 0;
    this.globalData['treemap']['percentual'] = 1;
    this.globalData['treemap']['total'] = 0;

    this.globalData['linhas'] = {};
    this.globalData['linhas']['valor'] = 0;
    this.globalData['linhas']['percentual'] = 0;

    this.globalData['mapa'] = {};
    this.globalData['mapa']['valor'] = 0;
    this.globalData['mapa']['percentual'] = 0;

    this.globalData['mapa-mundi'] = {};
    this.globalData['mapa-mundi']['valor'] = 0;
    this.globalData['mapa-mundi']['percentual'] = 0;

    this.jsonsProvider.getPTBR()
      .subscribe(d => {
        this.pt_br = d;
      })

  }

  getTotalBrasil (parameters): Observable<any[]> {
    return (this.http.get<any[]>(this.totalBrasilUrl+this.getQuery(parameters)));
  }

  getTotalSetor (parameters): Observable<any[]> {
    return (this.http.get<any[]>(this.totalSetorUrl+this.getQuery(parameters)));
  }

  getTotalDeg (parameters): Observable<any[]> {
    return (this.http.get<any[]>(this.totalDegUrl+this.getQuery(parameters)));
  }

  getTotalEstado (parameters): Observable<any[]> {
    return (this.http.get<any[]>(this.totalEstadoUrl+this.getQuery(parameters)));
  }

  getQuery(parameters : Object){
    return Object.keys(parameters)
                 .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
                  })
                  .join('&');
  }

  getDescriptionKey(parameters){

    var key = "";

    if(parameters.eixo == 3)
    {
      switch(parameters.typ)
      {
        case 1: key = 'e'; break;
        case 2: key = 'i'; break;
        case 3: key = 's'; break;
        case 4: key = 'c'; break;
      }
    }
    else if(parameters.eixo == 2)
    {

      if(parameters.uf != 0) key = key + "u";
      if(parameters.cad != 0) key = key + "s";
      if(parameters.deg != 0) key = key + "d";
      if(!(parameters.var == 18 || parameters.var == 19))
        if(parameters.mec != 0) key = key + "m";
      if(parameters.mod != 0) key = key + "n";
      if(parameters.pfj != 0) key = key + "p";
    }
    else
    {
      if(parameters.uf != 0) key = key + "u";
      if(parameters.cad != 0) key = key + "s";
      if(parameters.ocp > 0 && parameters.ocp != 3) key = key + "s";
      if(parameters.deg != 0) key = key + "d";
      if(parameters.mec != 0) key = key + "m";
      if(parameters.mod != 0) key = key + "n";
      if(parameters.pfj != 0) key = key + "p";
    }

    return key;

  }

  setGlobalData(valores){
    this.globalData[valores.view]['valor'] = valores.valor;
    this.globalData[valores.view]['percentual'] = valores.percentual;
    this.globalData[valores.view]['total'] = valores.total;

    if('uos1' in valores)
      this.globalData[valores.view]['uos1'] = valores.uos1;
    if('uos2' in valores)
      this.globalData[valores.view]['uos2'] = valores.uos2;
    if('uos3' in valores)
      this.globalData[valores.view]['uos3'] = valores.uos3;
  }

  getGlobalData(){
    return this.globalData;
  }

  mapPronome(string, array_pron, array_new_pron){
    array_pron.forEach(function(d, i){
        string = string.replace(array_pron[i], array_new_pron[i])
    })
    return string
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

  getCadName(idCad, eixo : number){
    idCad = parseInt(idCad);
    let cad : string;

    switch(idCad){
        case 0: cad = "Todos"; break;
        case 1: cad = "ARQUITETURA E DESIGN"; break;
        case 2: cad = "ARTES CÊNICAS E ESPETÁCULOS"; break;
        case 3: cad = "AUDIOVISUAL"; break;
        case 4: cad = "CULTURA DIGITAL"; break;
        case 5: cad = "EDITORIAL"; break;
        case 6: cad = "EDUCAÇÃO E CRIAÇÃO EM ARTES"; break;
        case 7: cad = "ENTRETENIMENTO"; break;
        case 8: cad = "MÚSICA"; break;
        case 9: cad = "PATRIMÔNIO"; break;
        case 10: cad = "PUBLICIDADE";
    }

    if(eixo == 3){
      if(idCad != 0) cad = 'NO SETOR '+cad;
      else cad = 'NOS SETORES CULTURAIS E CRIATIVOS';
    }

    return cad;

  }

  getMecName(idMec){

    idMec = parseInt(idMec);

    switch(idMec){
        case 0: return "Todos";
        case 1: return "FNC";
        case 2: return "Mecenato";
        case 3: return "Fundo Cultural";
        case 4: return "Outros";
    }
  }

  getPfjName(idPfj){

    idPfj = parseInt(idPfj);

    switch(idPfj){
        case 0: return "Todos";
        case 1: return "Pessoa Física";
        case 2: return "Pessoa Jurídica";
    }
  }

  getModName(idMod)
  {
    idMod = parseInt(idMod);

    switch(idMod){
        case 0: return "Todos";
        case 1: return "Direta";
        case 2: return "Indireta";
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

  getPrcName(idPrc){

    idPrc = parseInt(idPrc);

    switch(idPrc){
      case 0: return "Mundo";
      case 1: return "África";
      case 2: return "América do Norte";
      case 3: return "América do Sul";
      case 4: return "Ásia";
      case 5: return "Europa";
      case 6: return "Oceania";
    }
  }

  getDegName(subdeg, deg)
  {
    if(deg == 0)
    {

    }
    else if(deg == 1)
    {
      switch(subdeg)
      {
        case 1: return "Micro";
        case 2: return "Pequena";
        case 3: return "Média";
        case 4: return "Grande"
      }
    }
    else if(deg == 2) // sexo
    {
      switch(subdeg)
      {
        case 1: return "Masculino";
        case 2: return "Feminino";
      }
    }
    else if(deg == 3)
    {
      switch(subdeg)
      {
        case 1: return "10 a 17";
        case 2: return "18 a 29";
        case 3: return "30 a 49";
        case 4: return "50 a 64";
        case 5: return "65 ou mais";
        case 6: return "Não classificado";
      }
    }
    else if(deg == 4)
    {
      switch(subdeg)
      {
        case 1: return "Sem instrução";
        case 2: return "Fundamental Incompleto";
        case 3: return "Fundamental Completo";
        case 4: return "Médio Completo";
        case 5: return "Superior Incompleto";
        case 6: return "Superior Completo";
        case 7: return "Não Determinado";
      }
    }
    else if(deg == 5)
    {
      switch(subdeg)
      {
        case 1: return "Indígena";
        case 2: return "Branca";
        case 3: return "Preta";
        case 4: return "Amarela";
        case 5: return "Parda";
      }
    }
    else if(deg == 6)
    {
      switch(subdeg)
      {
        case 1: return "Formal";
        case 2: return "Informal";
      }
    }
    else if(deg == 7)
    {
      switch(subdeg)
      {
        case 1: return "Contribuinte";
        case 2: return "Não contribuinte";
      }
    }
    else if(deg == 8)
    {
      switch(subdeg)
      {
        case 1: return "Membro";
        case 2: return "Não membro";
      }
    }
  }

  getDegId(subdeg, deg)
  {
    switch(deg.toUpperCase())
    {
      case "MICRO": return 1;
      case "PEQUENA" : return 2;
      case "MÉDIA": return 3;
      case "GRANDE" : return 4;

      case "MASCULINO" : return 1;
      case "FEMININO" : return 2;

      case "10 A 17" : return 1;
      case "18 A 29" : return 2;
      case "30 A 49" : return 3;
      case "50 A 64" : return 4;
      case "65 OU MAIS" : return 5;

      case "SEM INSTRUÇÃO" : return 1;
      case "FUNDAMENTAL INCOMPLETO" : return 2;
      case "FUNDAMENTAL COMPLETO" : return 3;
      case "MÉDIO COMPLETO" : return 4;
      case "SUPERIOR INCOMPLETO" : return 5;
      case "SUPERIOR COMPLETO" : return 6;

      case "INDÍGENA" : return 1;
      case "BRANCA" : return 2;
      case "PRETA" : return 3;
      case "AMARELA" : return 4;
      case "PARDA" : return 5;

      case "INFORMAL" : return 2;
      case "FORMAL" : return 1;

      case "NÃO CONTRIBUINTE" : return 2;
      case "CONTRIBUINTE" : return 1;

      case "MEMBRO" : return 1;
      case "NÃO MEMBRO" : return 2;

      default: return 0;
    }
  }

  getFinalDesc(i, text, parameters){

    var deg_text = "";

    var cad_text = this.getCadName(parameters.cad, parameters.eixo);

    if(parameters.ocp == 1){
        cad_text = "EM ATIVIDADES RELACIONADAS À CULTURA";
    } else if(parameters.ocp == 2) {
        cad_text = "EM ATIVIDADES CULTURAIS";
    }

    if(parameters.eixo == 1 && parameters.deg > 0)
      deg_text = this.descDesag(parameters, this.getDegName(parameters.subdeg, parameters.deg), parameters.deg) ;

    var mec_text = this.getMecName(parameters.mec).toUpperCase();
    var mod_text = this.getModName(parameters.mod).toUpperCase();
    var pfj_text = this.getPfjName(parameters.pfj).toUpperCase();
    var prc_text = this.getPrcName(parameters.prc).toUpperCase();

    let nomeprc;

    //this.mapPronome(this.getPrepos(prc_text), ['DE', 'DA', 'DO'], ['', 'A', 'O'])+' '+prc_text

    var nomeano = parameters.ano;
    var anoanterior = parseInt(nomeano)-1;

    var uf_text = this.getUFName(parameters.uf).toUpperCase();
    var nomeestado = this.getPrepos(uf_text)+' '+uf_text;
    if(parameters.eixo == 0)
      deg_text = "DE"+' '+ this.getPorteName(parameters.deg);
    if(parameters.eixo == 3)
    {

      let desc_key = this.getDescriptionKey(parameters);
      switch(desc_key){
        case 'i':
          uf_text = this.mapPronome(this.getPrepos(uf_text), ['DE', 'DA', 'DO'], ['', 'A', 'O'])+' '+uf_text
          nomeprc = this.getPrepos(prc_text)+' '+prc_text
          break;
        case 'e':
          uf_text = this.getPrepos(uf_text)+' '+uf_text;
          nomeprc = this.mapPronome(this.getPrepos(prc_text), ['DE', 'DA', 'DO'], ['', 'A', 'O'])+' '+prc_text;
          break;
        case 'c':
          uf_text = this.mapPronome(this.getPrepos(uf_text), ['DE', 'DA', 'DO'], ['', 'A', 'O'])+' '+uf_text
          nomeprc = this.mapPronome(this.getPrepos(prc_text), ['DE', 'DA', 'DO'], ['', 'A', 'O'])+' '+prc_text;
          break;
      }
    }

    return text
    .replace('[uf]', nomeestado)
    .replace('{uf}', nomeestado)
    .replace('{cad}', cad_text)
    .replace('[cad]', cad_text)
    .replace('[deg]', deg_text)
    .replace('[ano]', "DO ANO "+anoanterior+' AO '+nomeano)
    .replace('[mec]', "VIA "+mec_text)
    .replace('[mod]', mod_text)
    .replace('[prc]', nomeprc)
    .replace('[pfj]', pfj_text);
  }

  isIHHorC4(parameters){
    if(parameters.eixo == 0)
    {
      if(parameters.var == 10 || parameters.var == 11 || parameters.var == 12 || parameters.var == 13)
        return true;
    }
    else if(parameters.eixo == 1)
    {
      if(parameters.var == 12 || parameters.var == 13 || parameters.var == 14 || parameters.var == 15)
        return true;
    }
    else if(parameters.eixo == 2)
    {
      if(parameters.var == 10 || parameters.var == 15 || parameters.var == 16)
        return true;
    }
    else if(parameters.eixo == 3)
    {
      if(parameters.var == 5 || parameters.var == 8)
        return true;

    }
    return false;
  }

  formatData(value, parameters)
  {
    if(Math.abs(value) > 1 || value == 0)
      return this.formatNumber(value);
    else
      return this.formatDecimal(value, parameters);

  }

  formatNumber(value)
  {
    if(value == undefined) return 1;

    if(value.toString().includes(".")){
      value = value.toFixed(2).toString().replace(".",",");
    }
    value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    let splitedValue = value.split(",");
    //let decimalPart = splitedValue[1];
    let integerPart = splitedValue[0].split(".");

    switch(integerPart.length)
    {
      case 1: return value;

      case 2: return integerPart[0] + "," + integerPart[1] + "K";

      case 3: return integerPart[0] + "," + integerPart[1] + "M";

      case 4: return integerPart[0] + "," + integerPart[1] + "B";

    }

    return;
  }

  formatDecimal(value, parameters)
  {

    let var_data = this.pt_br.var[parameters.eixo].filter( d => {
      if(d.id == parameters.var) return d;
    })[0];

    let sufixo = var_data.sufixo_valor;
    let prefixo= var_data.prefixo_valor;
    if(sufixo == '%')
      value = (value*100).toFixed(2);
    else if(value < 0.0000001)
      value = (value *10^9).toFixed(2) + "p";
    else if(value < 0.0001)
      value = (value * 10^6).toFixed(2) + "u";
    else if(value < 0.01)
      value = (value*10^3).toFixed(2) + "m";
    else
      value = (value).toFixed(2);

    return prefixo+String(value)+sufixo;
  }

descDesag(parameters, desc, deg)
{

  desc = desc.toUpperCase();


  switch(deg)
  {
      case 1:
          desc = "DE EMPRESAS DE PORTE "+desc; break;
      case 2:
          if(parameters.eixo == 6){
              desc = "DO SEXO "+desc; break;
          }
          else{
              desc = "DO SEXO "+desc; break;
          }
      case 3:
          desc = "COM IDADE ENTRE "+desc+" ANOS"; break;
      case 4:
          if(parameters.eixo  == 6){

              if(desc == "Sem Instrução")
                  desc = "QUE NÃO POSSUEM INSTRUÇÃO"
              else
                  desc = "QUE POSSUEM ESCOLARIDADE DE NÍVEL "+desc; break;
          }
          else{
              if(desc == "Sem Instrução")
                  desc = "E QUE NÃO POSSUEM INSTRUÇÃO"
              else
                  desc = "E QUE POSSUEM ESCOLARIDADE DE NÍVEL "+desc; break;
          }

      case 5:

          if(parameters.eixo  == 6){
              switch(desc){
                  case "Indígena":
                      desc = "DECLARADOS INDÍGENAS"; break;
                  case "Branca":
                      desc = "DECLARADOS BRANCOS"; break;
                  case "Preta":
                      desc = "DECLARADOS PRETOS"; break;
                  case "Amarela":
                      desc = "DECLARADOS AMARELOS"; break;
                  case "Parda":
                      desc = "DECLARADOS PARDOS"; break;
              }
          }
          else{
              switch(desc){
                  case "INDÍGENA":
                      desc = "DOS DECLARADOS INDÍGENAS"; break;
                  case "BRANCA":
                      desc = "DOS DECLARADOS BRANCOS"; break;
                  case "PRETA":
                      desc = "DOS DECLARADOS PRETOS"; break;
                  case "AMARELA":
                      desc = "DOS DECLARADOS AMARELOS"; break;
                  case "OARDA":
                      desc = "DOS DECLARADOS PARDOS"; break;
              }
          }

          desc = desc; break;
      case 6:
          if(desc == "FORMAL"){
              desc = "COM FORMALIDADE"; break;
          } else {
              desc = "SEM FORMALIDADE"; break;
          }
      case 7:
          if(desc == "CONTRIBUINTE"){
              desc = "COM PREVIDÊNCIA"; break;
          }
          else{
              desc = "SEM PREVIDÊNCIA"; break;
          }
      case 8:
          if(desc == "MEMBRO"){
              desc = "COM SINDICATO"; break;
          }
          else{
              desc = "SEM SINDICADO";break;
          }
      default:
          desc = "";
    }
    return desc;
  }

}
