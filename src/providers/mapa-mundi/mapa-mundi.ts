import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MapaMundiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapaMundiProvider {

  configUrl : string = 'http://143.54.230.124/ministerio/atlasOBEC/app/db/api/json_mapa.php?';

  constructor(public http: HttpClient) {

  }

  getData(parameters : string){
    return (this.http.get<any[]>(this.configUrl+parameters));
  }

}
