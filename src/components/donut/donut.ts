import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

import { Donut } from '../../interfaces/donut';
import {DonutProvider} from '../../providers/donut/donut';
/**
 * Generated class for the DonutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-donut',
  templateUrl: 'donut.html'
})
export class DonutComponent {
  @Input() width  : number = 500;
  @Input() height : number = 500;

  private radius : number = Math.min(this.width, this.height)/2;
  private svg;
  private data : any[] = [];
  private colors = {"Exportação": "red", "Importação": "blue"};
  private center : string = `translate(${this.width/2}, ${this.height/2})`;
  private index : boolean = true;
  private data_end = []

  arc = 
    d3.arc()
      .outerRadius(this.radius - this.radius/18)   //valor raio círculo de fora
      .innerRadius(this.radius - this.radius/2.5);

  pie : d3.Pie<any, Donut> = 
    d3.pie<Donut>()
      .sort((a: Donut, b: Donut) => a.index - b.index)
      .value((d : Donut) => d.valor); 
  
  constructor(private donutProvider : DonutProvider) {
  }

  ngOnInit() {
    this.getData();
  }

  update() : void {
    this.index = !this.index;
    this.donutProvider.getData(Number(this.index))
    .subscribe(data => {
      this.data_end = this.pie(data);
      let i = 0;
      let animation = setInterval(d => {
        this.data = d3.interpolate(this.data, this.data_end)(i);
        if (i >= 1){
          clearInterval(animation)
        }
        i  = i + 0.1;
      }, 10)
    });
  }

  getData(): void {
    this.donutProvider.getData(Number(this.index))
        .subscribe(data => {
          this.data = this.pie(data);
        });
  }

}
