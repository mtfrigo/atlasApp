import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { MapaMundiProvider } from '../../providers/mapa-mundi/mapa-mundi';
import { JsonsProvider } from '../../providers/jsons/jsons';
import * as d3  from 'd3';
import { DadosProvider } from '../../providers/dados/dados';
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
  @Output() dadoGlobal = new EventEmitter();

  width  : number = window.innerWidth*0.8;
  height : number = window.innerHeight*0.35;
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
      let percent : number = 1;
      let mundo_valor : number;
      for(let data in response){
        if(response[data].id != 0) this.gdpAux[this.unconvertCode(response[data].id)] = response[data].valor;
        else mundo_valor = response[data].valor;
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

      if(this.parameters.prc != 0){
        percent = this.gdpAux[this.unconvertCode(this.parameters.prc)]/mundo_valor;
      }
      
      this.dadoGlobal.emit({view: 'mapa-mundi', percentual: percent});

    })
  }

  getTransform(){
    let width_default = 898.5;
    let height_default = 452.27;
    let scale_width = (this.width)/width_default;
    let scale_height = (this.height)/height_default;
    let scale = Math.min(scale_width, scale_height);
    let transform = 0;
    if(scale_height < scale_width){
      transform = ((10+ window.innerWidth) - (width_default*scale_height))/2 ;
    }
    return 'scale('+scale+') translate('+transform+', 0)';
  }

  getColor(id: string){
    if(this.unconvertCode(this.parameters.prc) == id){
      return this.colors.eixo[this.parameters.eixo].color['1'];
    } else return this.scaleLinear(this.gdpAux[id])
  }

  updatePrc(prc : number){
    this.parameters.prc = prc;
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
