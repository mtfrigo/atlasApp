import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/*
  Generated class for the BarrasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const options = {
  'headers': new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
}


@Injectable()
export class BarrasProvider {

  configUrl = 'http://www.ufrgs.br/obec/atlas/api/json_barras.php?';

  constructor(public http: HttpClient) {

  }

  getData (parameters, uos : number): Observable<any[]> {
    console.log(this.configUrl+this.getQuery(parameters)+'&uos='+uos)
    return (this.http.get<any[]>(this.configUrl+this.getQuery(parameters)+'&uos='+uos));
  }

  getQuery(parameters : Object){
    return Object.keys(parameters)
                 .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
                  })
                  .join('&');
  }

}
