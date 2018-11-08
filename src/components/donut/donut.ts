import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

import { Donut } from '../../interfaces/donut';
import {DonutProvider} from '../../providers/donut/donut';
import { JsonsProvider } from '../../providers/jsons/jsons';
/**
 * Generated class for the DonutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-donut',
  templateUrl: 'donut.html'
})
export class DonutComponent implements OnChanges{
  width  : number = window.innerHeight*0.4;
  height : number = this.width;


  @Input() parameters : any;
  @Input() url : string;

  private radius : number = Math.min(this.width, this.height)/2;
  private svg;
  private data : any[] = [];
  private colors : any ;
  private center : string = `translate(${this.width/2}, ${this.height/2})`;
  private data_end = []

  arc =
    d3.arc()
      .outerRadius(this.radius - this.radius/18)   //valor raio círculo de fora
      .innerRadius(this.radius - this.radius/2.5);

  pie : d3.Pie<any, Donut> =
    d3.pie<Donut>()
      .sort((a: Donut, b: Donut) => a.index - b.index)
      .value((d : Donut) => d.valor);

  constructor(private donutProvider : DonutProvider, private jsonsProvider : JsonsProvider) {
  }

  ngOnInit() {
    this.jsonsProvider.getColors()
      .subscribe( d => {
        this.colors = d;
        this.getData();
      })
  }

  ngOnChanges() : void {
    this.donutProvider.getData(this.url)
    .subscribe(data => {
      this.data_end = this.pie(data);
      let i = 0;
      let animation = setInterval(d => {
        this.data = d3.interpolate(this.data, this.data_end)(i);
        if (i >= 1){
          clearInterval(animation)
        }
        i  = i + 0.1;
      }, 20)
    });

  }

  selectTyp(d){
    if(this.parameters.eixo == 3){
      this.parameters.typ = d.data.id;
    }    
  }

  getColor(tipo : string) {

    if(this.parameters.eixo == 2)
    {
      if(this.parameters.var == 17)
        return this.colors.binario[tipo].color;
      else
        return this.colors.cadeias[tipo].color;

    }

    else
      switch(tipo){
        case 'Exportação': return this.colors.eixo[this.parameters.eixo].color['1'];
        case 'Importação': return this.colors.eixo[this.parameters.eixo].color['2']
      }
  }


  getData(): void {
    this.donutProvider.getData(this.url)
        .subscribe(data => {
          this.data = this.pie(data);
        });
  }

  splitLegends(index: number){
    var legends = [];

    if(index == 0) for(let i = 0; i < this.data.length/2; i++) legends.push(this.data[i].data.tipo);
    if(index == 1) for(let i = Math.ceil(this.data.length/2); i < this.data.length; i++) legends.push(this.data[i].data.tipo);

    return legends;
  }

  getSubtitleStyle(tipo : string){
    return {
      'background-color': this.getColor(tipo),
      'width': '10px',
      'height': '10px',
      'margin-top': '3px'
    }
  }

}
