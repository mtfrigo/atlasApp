import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DonutProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DonutProvider {
  donutUrl : string = 'http://143.54.230.124/ministerio/atlasOBEC/app/db/api/json_donut.php'

   constructor(public http: HttpClient) {
  }

  getData(parameters){
    return this.http.get<any[]>(this.donutUrl+'?'+parameters);
  }


}
