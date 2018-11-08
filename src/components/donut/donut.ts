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

  getColor(tipo : string) {
    switch(tipo){
      case 'Exportação': return this.colors.eixo[this.parameters.eixo].color['1'];
      case 'Importação': return this.colors.eixo[this.parameters.eixo].color['2']
    }
  }

  getData(): void {
    console.log(this.url)
    this.donutProvider.getData(this.url)
        .subscribe(data => {
          this.data = this.pie(data);
        });
  }

  splitLegends(){
    var legends = [[],[]]
    for(let i = 0; i < this.data.length; i++){
      legends[i%2].push(this.data[i].tipo);
    }

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
