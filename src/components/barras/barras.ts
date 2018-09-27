import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";

import { BarrasProvider } from '../../providers/barras/barras';

/**
 * Generated class for the BarrasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'barras',
  templateUrl: 'barras.html'
})
export class BarrasComponent {

  text: string;
  view_title: string;

  width: number;
  height: number;
  margin = {top: 20, right: 20, bottom: 30, left: 40};

  x: any;
  y: any;
  svg: any;
  g: any;

  valueTop = this.margin.top + 5;

  data: any = [];

  minBarHeight = 6;

  dados = {key: [], value: [], percentual: [], taxa: [], percentual_setor: []};

  xAxis: any;
  yAxis: any;


  constructor(public navCtrl: NavController, private barrasProvider: BarrasProvider) {
    this.view_title = 'Histograma'

    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.getData();

  }

  ionViewDidLoad() {

  }

  afterGetData(){
    this.parseData();
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  getData(): void {

    this.barrasProvider.getData()
      .subscribe(response => (this.data = response),
                 error => 'oioio',
                 () => this.afterGetData()
                );

  }

  parseData(){

    var parent_data = this.data;
    var parent_dados = this.dados;

    Object.keys(this.data).forEach(function (key) {
      parent_dados.percentual_setor.push(parent_data[key].valor/5)
      parent_dados.key.push(parent_data[key].ano);
      parent_dados.value.push(parent_data[key].valor);
    });

    this.dados.key = d3.keys(this.data);

  }

  initSvg() {
    this.svg = d3.select("#barChart")
        .append("svg")
        // .attr("width", this.width + this.margin.left + this.margin.right)
        // .attr("height", this.height + this.margin.top + this.margin.bottom)
        .attr("width", '100%')
        .attr("height", this.height)
        .attr('viewBox','0 0 900 500')
        .attr("type", "simples");

    this.g = this.svg.append("g")
        .attr("transform", "translate(" + (this.margin.left+5) + "," + this.valueTop + ")");

    // this.svg.append("g")
    //   .attr("class", "grid")
    //   .style("opacity", 0.1)
    //   .call(
    //     d3.axisLeft(this.y)
    //       .scale(this.y)
    //       .ticks(4)
    //       .tickSize(-this.width + 10)
    //       .tickSizeOuter(0));

  }

  initAxis() {

    this.x = d3.scaleBand()
      .domain(this.dados.key)
      .rangeRound([0, this.width])
      .padding(0.1);;
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);

    this.y.domain(d3.extent(this.dados.value, function (d) {
      return d;
    })).nice();


  }

  drawAxis() {
    this.g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3Axis.axisBottom(this.x));

    this.g.append("g")
        .attr("class", "axis axis--y")
        .call(d3Axis.axisLeft(this.y))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");
  }

  drawBars() {
    this.g.selectAll("rect")
        .data(this.dados.value)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => this.x(this.dados.key[i]))
        .attr("y", (d) => this.getBarY(d))
        .attr("height", (d) => this.getBarHeight(d) )
        .attr("width", this.x.bandwidth())
        .attr("data-color", 'red');
  }

  getBarY(d) {

    var barHeight = this.y(d);
    var zeroPosition = d3.min(this.dados.value) < 0 ? this.y(0) : false;
    var isValueNegative = d < 0;

    // TEM VALOR NEGATIVO
    if (isValueNegative) {

        // NÚMERO NEGATIVO
        if (isValueNegative)
            return zeroPosition;
        // S barra for muito pequena
        if (barHeight == zeroPosition)
            return zeroPosition - 5;

        return this.y(0);
    }

    barHeight = Math.abs(this.height - barHeight);

    // BARRA PEQUENA
    if (barHeight <= this.minBarHeight){
        return this.height - 5;
    }
    return this.y(d);

  }

  getBarHeight(d) {

    var barHeight = this.y(d);

    console.log(barHeight)

    // TEM VALOR NEGATIVO
    var zeroPosition = d3.min(this.dados.value) < 0 ? this.y(0) : this.height;
    var isValueZero = this.y(d) == zeroPosition;

    if (isValueZero){
        return this.minBarHeight;
    }

    barHeight = Math.abs(this.height - barHeight);

    // BARRA PEQUENA
    if (barHeight <= this.minBarHeight){
        return Math.abs(5);
    }

    return  Math.abs(this.y(d) - zeroPosition);

  }

}
