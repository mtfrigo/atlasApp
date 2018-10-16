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
  new_data: any;

  minBarHeight = 1;

  dados = {key: [], value: [], percentual: [], taxa: [], percentual_setor: []};

  keys: any = [];
  values: number[] = [];
  minValue: any;
  maxValue: any;

  barsHeight: any;
  barsWidth:any;

  index = true;

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
    this.parseData(data);
    this.initAxis();

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
       .subscribe(response => (this.new_data = response),
                  error => 'oioio',
                  () => {

                    this.animateBars()

                  }
                 );
  }

  parseData(data){

    for(var i = 0; i < data.length; i++)
    {
      this.keys.push(data[i].ano);
      this.values.push(data[i].valor);
    }
    var edgeValues = d3.extent(this.values);

    this.maxValue = edgeValues[1];
    this.minValue = edgeValues[0];

    ;

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
    this.sendBarData(this.new_data[this.parameters.ano - 2007].valor, this.new_data[this.parameters.ano - 2007].percentual);

    //this.dadosProvider.setGlobalData('barras', this.new_data[this.parameters.ano - 2007].valor, this.new_data[0].percentual);


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

  getBarColor(){
    return (this.colors['cadeias'][this.parameters.cad]['color'])
  }
}
