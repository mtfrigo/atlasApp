import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Treemap } from '../../interfaces/treemap';

/*
  Generated class for the TreemapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TreemapProvider {
  
  treemapUrl : string = "http://www.ufrgs.br/obec/atlas/api/json_treemap_scc.php";

  constructor(public http: HttpClient) {
  }

  getData(parameters : string){
    return this.http.get<Treemap[]>(this.treemapUrl+'?'+parameters);
  }

}
