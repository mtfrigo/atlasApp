import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MapaMundiProvider } from '../../providers/mapa-mundi/mapa-mundi';
import { JsonsProvider } from '../../providers/jsons/jsons';
import * as d3  from 'd3';
/**
 * Generated class for the MapaMundiComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-mapa-mundi',
  templateUrl: 'mapa-mundi.html'
})

export class MapaMundiComponent implements OnInit, OnChanges{

  @Input() parameters : any;
  @Input() url : string;
  gdpAux = {'AF': 0, 'NA': 0, 'SA': 0, 'OC': 0, 'AS': 0, 'EU': 0};
  colors : any;
  minValue : number = 0;
  maxValue : number = 0;
  ready : boolean = false;
  private scaleLinear;


  constructor(private provider : MapaMundiProvider,
              private jsonProvider : JsonsProvider) {

  }

  ngOnInit(){
    this.jsonProvider.getColors()
    .subscribe( d => {
      
        this.colors = d;

      this.getData()
    })
  }

  ngOnChanges(){
    this.getData()
  }

  getData(){
    this.provider.getData(this.url)
    .subscribe(response => {
      
      for(let data in response){
        if(response[data].id != 0) this.gdpAux[this.unconvertCode(response[data].id)] = response[data].valor;
      }

      this.minValue = d3.min(response.map(d => {
        if(d.id != '0')
          return d.valor
      }));
      this.maxValue = d3.max(response.map(d => {
        if(d.id != '0')
          return d.valor
      }));


      this.scaleLinear = d3.scaleLinear()
        .domain([this.minValue, this.maxValue])
        .range([this.colors.cadeias[this.parameters['cad']].gradient['2'], this.colors.cadeias[this.parameters['cad']].gradient['6']]);


      this.ready = true;

    })
  }

  getColor(id: string){
    return this.scaleLinear(this.gdpAux[id])
  }

  unconvertCode(code) {
    switch(code) {
        case 1:
            return "AF";
        case 2:
            return "NA";
        case 3:
            return "SA";
        case 4:
            return "AS";
        case 5:
            return "EU";
        case 6:
            return "OC";
    }
}

}
