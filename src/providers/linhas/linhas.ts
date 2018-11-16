import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the LinhasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LinhasProvider {

  configUrl = 'http://www.ufrgs.br/obec/atlas/api/json_linhas.php?';

  constructor(public http: HttpClient) {

  }

  getData (parameters): Observable<any[]> {
    return (this.http.get<any[]>(this.configUrl+this.getQuery(parameters)));
  }

  getQuery(parameters : Object){
    return Object.keys(parameters)
                 .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
                  })
                  .join('&');
  }




}
