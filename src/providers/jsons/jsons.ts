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
  private brStatesUrl : string = "assets/json/br-min.json";


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

}
