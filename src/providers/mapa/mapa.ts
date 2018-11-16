import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/*
  Generated class for the MapaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapaProvider {

  configUrl = 'http://www.ufrgs.br/obec/atlas/api/json_mapa.php?';
  constructor(public http: HttpClient) {
  }

  getData (parameters : string): Observable<any[]> {
    console.log(this.configUrl+parameters)
    return (this.http.get<any[]>(this.configUrl+parameters));
  }

}
