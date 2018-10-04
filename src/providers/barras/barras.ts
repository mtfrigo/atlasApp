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

  configUrl = 'http://localhost/atlasApp/src/api/json_barras.php?var=1&chg=0&uf=0&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos';

  constructor(public http: HttpClient) {
    console.log('Hello ConfigProvider Provider');
  }

  getData (uf): Observable<any[]> {
    return (this.http.get<any[]>('http://localhost/atlasApp/src/api/json_barras.php?var=1&chg=0&uf='+uf+'&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos'));
  }


}
