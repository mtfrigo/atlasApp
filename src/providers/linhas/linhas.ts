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

  configUrl = 'http://localhost/atlasApp/src/api/json_linhas.php?var=3&chg=0&uf=0&deg=0&cad=0&ano=2014&eixo=empreendimentos#empreendimentos';

  constructor(public http: HttpClient) {
    console.log('Hello ConfigProvider Provider');
  }

  getData (): Observable<any[]> {
    return (this.http.get<any[]>(this.configUrl));
  }



}
