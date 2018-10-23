import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the EmpilhadasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmpilhadasProvider {

  configUrl = 'http://143.54.231.10/atlasApp/src/api/json_barras_empilhadas.php?';
  //configUrl = 'http://143.54.230.124/ministerio/atlasOBEC/app/db/api_json_barras.php?';
  constructor(public http: HttpClient) {

  }

  getData (parameters, uos : number): Observable<any[]> {
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