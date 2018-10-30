import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the JsonsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JsonsProvider {
  private colorsUrl : string = "assets/json/colors.json";
  private ptbrUrl   : string = "assets/json/pt-br.json";
  private ufUrl   : string = "assets/json/uf.json";
  private descricoesUrl   : string = "assets/json/descricoes.json";
  private brStatesUrl : string = "assets/json/br-min.json";
  private selectDesags : string = "assets/json/select-deg.json";
  private anos_default : string = "http://143.54.230.124/ministerio/atlasOBEC/app/db/api_anos_default.php";


  constructor(public http: HttpClient) {

  }

  getUfJson(){
    return this.http.get(this.ufUrl)
  }

  getColors(){
    return this.http.get(this.colorsUrl);
  }

  getPTBR(){
    return this.http.get(this.ptbrUrl);
  }

  getBrStates(){
    return this.http.get(this.brStatesUrl);
  }

  getDescricoes(){
    return this.http.get(this.descricoesUrl);
  }

  getAnos(eixo : number){
    return this.http.get<number[]>(this.anos_default+'?eixo='+eixo);
  }

  getSelectDesags(){
    return this.http.get(this.selectDesags);
  }

}
