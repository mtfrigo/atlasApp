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

  configUrl = 'http://143.54.231.10/atlasApp/src/api/json_linhas.php?var=3&chg=0&uf=32&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos';

  constructor(public http: HttpClient) {

  }

  getData (uf): Observable<any[]> {
    return (this.http.get<any[]>("http://143.54.231.10/atlasApp/src/api/json_linhas.php?var=3&chg=0&uf="+uf+"&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimento"));
  }




}
