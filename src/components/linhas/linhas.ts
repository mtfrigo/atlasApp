import { Component, Input } from '@angular/core';

import { NavController } from 'ionic-angular';
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

/**
 * Generated class for the LinhasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-linhas',
  templateUrl: 'linhas.html'
})
export class LinhasComponent {
  @Input() width  : number = 900;
  @Input() height : number = 500;

  text: string;

  data = [];


  margin = {top: 0, right: 0, bottom: 40, left: 80};
  linesWidth: any;
  linesHeight: any;

  x: any;
  y: any;

  keyLines: any = [];

  values = [];
  minValue: any;
  maxValue: any;


  constructor(public navCtrl: NavController, private linhasProvider: LinhasProvider) {
    this.text = 'Hello World';

    this.linesHeight = this.height - this.margin.top - this.margin.bottom;
    this.linesWidth = this.width - this.margin.left - this.margin.right;
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {

    this.linhasProvider.getData()
      .subscribe(response => (this.data = response),
                 error => 'oioio',
                 () => this.afterGetData()
                );
  }

  afterGetData() {
    this.parseData();
    this.initAxis();
  }

  parseData() {

    var aux = [];

    Object.keys(this.data[0]).forEach(function (key) {
      if(key != "ano") aux.push(key);
    });

    this.keyLines = aux;
    var auxKeys = this.keyLines;

    var aux = this.data;

    console.log(this.data)

    var values = [];

    Object.keys(aux).forEach(function (lol) {
      Object.keys(auxKeys).forEach(function (key) {
         values.push(aux[lol][auxKeys[key]])
      });
    });

    this.values = values;

    this.minValue = d3.min (values, function(d) {
      return Math.min(d);
    });

    this.maxValue = d3.max (values, function(d) {
      return Math.max(d);
    });

  }

  initAxis(){
    this.x.domain(d3.extent(this.data, function(d) { return d.ano; }));

    this.y.domain([this.minValue, this.maxValue]).domain(d3.extent(this.data, function(d) { return d.ano; }));
  }

  getLinesTransform()
  {
    return "translate(" + (this.margin.left+5) + "," + (this.margin.top+5) + ")";
  }

  getLinePath(d, i){

    console.log(this.x(d.ano));
    return d3.line()
    .x(function(d) { return this.x(d.ano); })
    .y(function(d) { return this.y(d.valor); });
  }

}
