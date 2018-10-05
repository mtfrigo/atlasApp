import { Component, Input } from '@angular/core';

import { NavController, Alert } from 'ionic-angular';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";

import { LinhasProvider } from '../../providers/linhas/linhas';
import { JsonsProvider } from '../../providers/jsons/jsons';

/**
 * Generated class for the LinhasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-linhas',
  templateUrl: 'linhas.html'
})
export class LinhasComponent {
  @Input() width  : number = 900;
  @Input() height : number = 500;

  text: string;

  yTicks: any;
  yTicksArray: any;
  yTicksScale: any;

  data = [];
  new_data = [];
  colors: any;

  margin = {top: 0, right: 30, bottom: 40, left: 80};
  linesWidth: any;
  linesHeight: any;

  x: any;
  y: any;
  linePath: any;

  ids: any = [];
  values: any = [];
  anos: any = [];

  edgeValues: any;
  minValue: any;
  maxValue: any;

  uf_index: any = 0;
  ufs = [0, 32];


  constructor(public navCtrl: NavController, private linhasProvider: LinhasProvider, private jsonProvider: JsonsProvider) {
    this.text = 'Hello World';

    this.linesHeight = this.height - this.margin.top - this.margin.bottom;
    this.linesWidth = this.width - this.margin.left - this.margin.right;

    this.yTicks = 7;
    this.yTicksArray = [];

    for(var i = 0; i < this.yTicks; i++){
      this.yTicksArray.push(i);
    }
  }

  ngOnInit() {

    this.jsonProvider.getColors()
      .subscribe(d=>{
        this.colors = d;
        this.getData();
    })

  }

  getData(): void {

    this.linhasProvider.getData(this.ufs[this.uf_index])
      .subscribe(response => (this.data = response),
                 error => '[LINHAS] ERRO!',
                 () => this.afterGetData()
                );
  }

  updateData(): void {

    if(this.uf_index++ >= this.ufs.length -1) this.uf_index = 0;

    this.linhasProvider.getData(this.ufs[this.uf_index])
      .subscribe(response => (this.new_data = response),
                 error => '[LINHAS] ERRO!',
                 () => this.animateLines()
                );
  }

  afterGetData() {

    this.data = this.parseData(this.data);
    this.initAxis();
  }

  parseData(data) {

    this.values = data[0];
    data.shift();

    this.ids = data[0];
    data.shift();

    this.anos = data[0];
    data.shift();

    this.edgeValues = d3.extent(this.values, function (d) { return d; })

    this.minValue = this.edgeValues[0];
    this.maxValue = this.edgeValues[1];

    return data;
  }

  initAxis(){

    this.x = d3
      .scaleTime().range([0, this.linesWidth])
      .domain(d3.extent(this.anos, function(d) { return d; }));

    this.y = d3
      .scaleLinear().range([this.linesHeight, 0])
      .domain([this.minValue, this.maxValue]);

    this.yTicksScale = d3.scaleLinear()
    .range([this.y(this.minValue), this.y(this.maxValue)])
    .domain(d3.extent(this.yTicksArray, function (d) {
      return d;
    })).nice();

    var x = this.x;
    var y = this.y;

    this.linePath = d3.line()
    .x(function(d) { return x(d.ano); })
    .y(function(d) { return y(d.valor);});
  }

  getLinesTransform()
  {
    return "translate(" + (this.margin.left+5) + "," + (this.margin.top+5) + ")";
  }

  getLineColor(d){

    return this.colors.cadeias[d[0].id].color;

  }

  getTickY(d, i){
    return 'translate(0, ' +  this.yTicksScale(d) + ')';
  }

  getTickYValue(d,i)
  {

    var tickValue = d3Scale.scaleLinear()
    .domain([ 0, this.yTicksArray[this.yTicksArray.length-1]])
    .range([this.minValue, this.maxValue])(i);

    return  tickValue;
  }

  getTickX(d){

    return 'translate('+ this.x(d) +', '+ this.linesHeight +')';
  }

  update() : void {

    this.updateData();


  }

  animateLines() : void {

    this.new_data = this.parseData(this.new_data);

    let i = 0;

    let animation = setInterval(d => {
      this.data = d3.interpolate(this.data, this.new_data)(i);
      if (i >= 1){
        clearInterval(animation)
      }
    i  = i + 0.1;
    }, 30)

    this.initAxis();

  }



}
