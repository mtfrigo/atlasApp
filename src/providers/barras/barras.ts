import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
  Generated class for the BarrasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BarrasProvider {

  configUrl = 'http://143.54.231.10/atlasApp/src/api/json_barras.php?var=1&chg=0&uf=0&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos';

  constructor(public http: HttpClient) {

  }

  getData (parameters): Observable<any[]> {
    // console.log(this.getQuery(parameters))
    return (this.http.get<any[]>('http://143.54.231.10/atlasApp/src/api/json_barras.php?'+this.getQuery(parameters)));
  }

  getQuery(parameters : Object){
    return Object.keys(parameters)
                 .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
                  })
                  .join('&');
  }


}
