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

  configUrl = 'http://www.ufrgs.br/obec/atlas/teste_design_novo/db/json_barras.php';

  constructor(public http: HttpClient) {
    console.log('Hello ConfigProvider Provider');
  }

  getData (): Observable<any[]> {
    return (this.http.get<any[]>(this.configUrl));
  }


}
