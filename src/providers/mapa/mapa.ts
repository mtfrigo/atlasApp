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

  configUrl = 'http://localhost/atlasApp/src/api/json_mapa.php?var=1&chg=0&uf=0&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos';

  constructor(public http: HttpClient) {
  }

  getData (cad): Observable<any[]> {
    return (this.http.get<any[]>('http://143.54.231.10/atlasApp/src/api/json_mapa.php?var=1&chg=0&uf=0&deg=0&cad='+cad+'&ano=2014&eixo=empreendimentos#empreendimentos'));
  }

}
