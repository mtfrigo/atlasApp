import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DonutProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DonutProvider {
  donutUrl : string[] = ['http://143.54.230.124/ministerio/atlasOBEC/app/db/json_donut.php?view=mapa&var=1&prt=0atc=0&cad=0&ocp=0&&ano=2017&deg=0&uos=0&uf=0&typ=1&prc=0&slc=0&eixo=3', 
   'http://143.54.230.124/ministerio/atlasOBEC/app/db/json_donut.php?view=mapa&var=1&prt=0atc=0&cad=0&ocp=0&&ano=2017&deg=0&uos=0&uf=35&typ=1&prc=0&slc=0&eixo=3']
  
   constructor(public http: HttpClient) {
  }

  getData(url_index: number){
    return this.http.get<any[]>(this.donutUrl[url_index]);
  }

}
