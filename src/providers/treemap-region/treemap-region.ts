import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Treemap } from '../../interfaces/treemap';

/*
  Generated class for the TreemapRegionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TreemapRegionProvider {

  treemapUrl : string = "http://www.ufrgs.br/obec/atlas/api/json_treemap_region.php";

  constructor(public http: HttpClient) {
  }

  getData(parameters : string){
    return this.http.get<Treemap[]>(this.treemapUrl+'?'+parameters);
  }

}
