import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { NavController } from 'ionic-angular';

import { JsonsProvider } from '../../providers/jsons/jsons';

import * as d3 from "d3";
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";

import { BarrasProvider } from '../../providers/barras/barras';
import { DadosProvider } from '../../providers/dados/dados';

/**
 * Generated class for the BarrasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-barras',
  templateUrl: 'barras.html',
})

export class BarrasComponent implements OnChanges{
  width  : number = window.innerWidth*0.9;
  height : number = window.innerHeight*0.5;

  @Input() parameters : any;
  @Input() url : string;

  @Output() dadoGlobal = new EventEmitter();


  private colors;

  view_title: string;
  interval_animation : number = 20;
  yTicks: any;
  yTicksArray: number[];
  yTicksScale: any;

  margin = {top: 0, right: 5, bottom: 30, left: window.innerWidth*0.05};

  x: any;
  y: any;
  svg: any;
  g: any;

  valueTop = this.margin.top + 5;

  data: any = [];

  minBarHeight = 1;

  dados = {key: [], value: [], percentual: [], taxa: [], percentual_setor: []};

  heights : number[] = []; // lista que guarda as informações de altura de cada barras ( acesso pelo índice das barras )
  y_list : number[] = [];
  keys: any = [];
  values: number[] = [];
  minValue: any;
  maxValue: any;

  barsHeight: any;
  barsWidth:any;

  index = true;
  first_year: any;

  constructor(public navCtrl: NavController, private barrasProvider: BarrasProvider, private dadosProvider: DadosProvider,private jsonsProvider: JsonsProvider) {
    this.view_title = 'Histograma'

    this.barsHeight = this.height - this.margin.top - this.margin.bottom;
    this.barsWidth = this.width - this.margin.left - this.margin.right;

    this.yTicks = 7;
    this.yTicksArray = [];

    for(var i = 0; i < this.yTicks; i++){
      this.yTicksArray.push(i);
    }


  }

  ngOnInit() {

    this.jsonsProvider.getColors()
      .subscribe(d=>{
        this.colors = d;
        this.getData();
    })
  }

  ngOnChanges(){

    this.updateData();
  }

  sendBarData(valor, percent) {
    this.dadoGlobal.emit({view: 'barras', valor: valor, percentual: percent});
  }

  ionViewDidLoad() {

  }

  afterGetData(data){
    this.initAxis();
    this.parseData();
    this.heights = this.getHeightList(data);
    this.y_list = this.getYList(data);

  }

  getData(): void {
    this.barrasProvider.getData(this.parameters)
      .subscribe(response => (this.data = response),
                 error => 'oioio',
                 () => this.afterGetData(this.data)
                );
  }

  updateData() : void {


       this.barrasProvider.getData(this.parameters)
       .subscribe(response => (this.data = response),
                  error => 'oioio',
                  () => {
                    this.animateBars()
                  }
                 );
  }

  parseData(){

    this.keys = this.data.map( d => d.ano);
    this.values = this.data.map( d => d.valor);

    this.first_year = this.keys[0];

    var edgeValues = d3.extent(this.values);

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
      .domain([this.minValue, this.maxValue]).nice();




    this.yTicksScale = d3Scale.scaleLinear()
    .rangeRound([this.y(this.minValue), this.y(this.maxValue)])
    .domain(d3.extent(this.yTicksArray)).nice();

  }


  getHeightList(data){
    return data.map(d => this.getBarHeight(d.valor));
  }

  getYList(data){
    return data.map(d => this.getBarY(d.valor));
  }

  getTickYValue(d,i)
  {

    return d3Scale.scaleLinear()
      .domain(d3.extent(this.yTicksArray))
      .rangeRound([this.minValue, this.maxValue])(i);
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
    var zeroPosition = this.minValue < 0 ? this.y(0) : false;
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

    this.parseData();
    let index_ano = this.keys.indexOf(this.parameters.ano);
    this.sendBarData(this.data[index_ano].valor, this.data[index_ano].percentual);

    let i = 0;
    let n_iteracoes = 20; //ideal que seja divisor de 100 ou 1000 (aumentando deixa mais smooth)

    this.initAxis();

    let animation = setInterval(d => {

      let new_height_list = this.getHeightList(this.data);
      let new_y_list = this.getYList(this.data);

      this.heights = d3.interpolate(this.heights, new_height_list)(i);
      this.y_list = d3.interpolate(this.y_list, new_y_list)(i);

      if (i >= 1){
        clearInterval(animation)
      }

      i  = i + 1/n_iteracoes ;
    }, this.interval_animation)
  }

  getBarColor(){
    return (this.colors['cadeias'][this.parameters.cad]['color'])
  }
}
