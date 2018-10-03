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

import { BarrasProvider } from '../../providers/barras/barras';

/**
 * Generated class for the BarrasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'barras',
  templateUrl: 'barras.html',

})
export class BarrasComponent {
  @Input() width  : number = 900;
  @Input() height : number = 500;

  view_title: string;

  yTicks: any;
  yTicksArray: any;
  yTicksScale: any;

  margin = {top: 0, right: 0, bottom: 40, left: 80};

  x: any;
  y: any;
  svg: any;
  g: any;

  valueTop = this.margin.top + 5;

  data: any = [];
  new_data: any;

  minBarHeight = 1;

  dados = {key: [], value: [], percentual: [], taxa: [], percentual_setor: []};

  keys: any = [];
  values: any = [];
  minValue: any;
  maxValue: any;

  barsHeight: any;
  barsWidth:any;

  index = true;

  uf_index: any = 0;
  ufs = [0, 31, 50, 51];

  data1 = [

    {"uf":"Todos","ano":2007,"valor":104522,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2008,"valor":91097,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2009,"valor":93585,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2010,"valor":97525,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2011,"valor":102031,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2012,"valor":104544,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2013,"valor":91097,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2014,"valor":108759,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2015,"valor":104544,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2016,"valor":91097,"percentual":1,"taxa":0}]

  data2 = [

    {"uf":"Todos","ano":2007,"valor":88773,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2008,"valor":91097,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2009,"valor":93585,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2010,"valor":97525,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2011,"valor":102031,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2012,"valor":104544,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2013,"valor":107339,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2014,"valor":108759,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2015,"valor":107498,"percentual":1,"taxa":0},
    {"uf":"Todos","ano":2016,"valor":111000,"percentual":1,"taxa":0}]


  constructor(public navCtrl: NavController, private barrasProvider: BarrasProvider) {
    this.view_title = 'Histograma'

    this.barsHeight = this.height - this.margin.top - this.margin.bottom;
    this.barsWidth = this.width - this.margin.left - this.margin.right;

    this.uf_index = 0;
    this.ufs = [31, 50, 51];

    this.yTicks = 7;
    this.yTicksArray = [];

    for(var i = 0; i < this.yTicks; i++){
      this.yTicksArray.push(i);
    }

  }

  ngOnInit() {
    this.getData();

  }

  ionViewDidLoad() {

  }

  afterGetData(data){
    this.parseData(data);
    this.initAxis();

  }

  getData(): void {

    this.barrasProvider.getData(this.ufs[this.uf_index])
      .subscribe(response => (this.data = response),
                 error => 'oioio',
                 () => this.afterGetData(this.data)
                );

  }

  updateData() : void {


    if(this.uf_index++ >= this.ufs.length -1) this.uf_index = 0;

     this.barrasProvider.getData(this.ufs[this.uf_index])
       .subscribe(response => (this.new_data = response),
                  error => 'oioio',
                  () => this.animateBars()
                 );

  }

  parseData(data){
    for(var i = 0; i < data.length; i++)
    {
      this.keys.push(data[i].ano);
      this.values.push(data[i].valor);
    }

    var edgeValues = d3.extent(this.values, function (d) {
      return d;
    })

    this.maxValue = edgeValues[1];
    this.minValue = edgeValues[0];

  }

  initAxis() {

    this.x = d3.scaleBand()
      .domain(this.keys)
      .rangeRound([0, this.barsWidth])
      .padding(0.1);

    this.y = d3Scale.scaleLinear()
      .rangeRound([this.barsHeight, 0])
      .domain(d3.extent(this.values, function (d) {
        return d;
      })).nice();




    this.yTicksScale = d3Scale.scaleLinear()
    .rangeRound([this.y(this.minValue), this.y(this.maxValue)])
    .domain(d3.extent(this.yTicksArray, function (d) {
      return d;
    })).nice();

  }

  getTickYValue(d,i)
  {

    return d3Scale.scaleLinear()
    .domain(d3.extent(this.yTicksArray, function (d) {
      return d;
    }))
    .rangeRound(d3.extent(this.values, function (d) {
      return d;
    }))(i);
  }

  getTickY(d, i){
    return 'translate(0, ' +  this.yTicksScale(d) + ')';
  }

  getTickX(d, i){
    return 'translate('+ this.x(d.ano) +', '+ this.barsHeight +')';
  }



  getBarsTransform()
  {
    return "translate(" + (this.margin.left+5) + "," + this.valueTop + ")";
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

    barHeight = Math.abs(this.barsHeight - barHeight);

    // BARRA PEQUENA
    if (barHeight <= this.minBarHeight){
        return this.barsHeight - 5;
    }
    return this.y(d);

  }

  getBarHeight(d) {

    var barHeight = this.y(d);

    // TEM VALOR NEGATIVO
    var zeroPosition = d3.min(this.values) < 0 ? this.y(0) : this.barsHeight;
    var isValueZero = this.y(d) == zeroPosition;

    if (isValueZero){
        return this.minBarHeight;
    }

    barHeight = Math.abs(this.barsHeight - barHeight);

    // BARRA PEQUENA
    if (barHeight <= this.minBarHeight){
        return  this.minBarHeight;
    }

    return  Math.abs(this.y(d) - zeroPosition);

  }

  update() : void {

    this.updateData();

  }

  animateBars() : void {

    this.values = [];
    this.keys = [];

    this.parseData(this.new_data);

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
