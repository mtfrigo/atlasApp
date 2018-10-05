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
  private brStatesUrl : string = "assets/json/br-min.json";


  constructor(public http: HttpClient) {
  }

  getColors(){
    return this.http.get(this.colorsUrl);
  }

  getBrStates(){
    return this.http.get(this.brStatesUrl);
  }

}
