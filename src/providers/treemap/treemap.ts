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
  treemapUrl : string = "http://143.54.230.124/ministerio/atlasOBEC/app/db/json_treemap_scc.php?var=1&chg=0&uf=0&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos";
  
  constructor(public http: HttpClient) {
  }

  getData(){
    return this.http.get<Treemap[]>(this.treemapUrl);
  }

}
