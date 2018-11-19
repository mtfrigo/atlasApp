import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { NavController } from 'ionic-angular';

import { JsonsProvider } from '../../providers/jsons/jsons';

import * as d3 from "d3";
import * as d3Scale from "d3-scale";

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
  width  : number = window.innerWidth*0.8;
  height : number = window.innerHeight*0.35;

  @Input() parameters : any;
  @Input() url : string;
  @Input() uos : number = 0;
  @Output() dadoGlobal = new EventEmitter();


  private colors;

  view_title: string;
  interval_animation : number = 10;
  yTicks: any;
  yTicksArray: number[];
  yTicksScale: any;

  margin = {top: 0, right: 5, bottom: 30, left: window.innerWidth*0.075};

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

    if(this.dadosProvider.isIHHorC4(this.parameters)){

      if(this.uos == 1)
        this.dadoGlobal.emit({view: 'barras', uos2: valor, percentual: percent});
      else if(this.uos == 0)
        this.dadoGlobal.emit({view: 'barras', uos1: valor, percentual: percent});
      else if(this.uos == 2)
        this.dadoGlobal.emit({view: 'barras', uos3: valor, percentual: percent});
    }
    else{
      this.dadoGlobal.emit({view: 'barras', valor: valor, percentual: percent});
    }

  }

  ionViewDidLoad() {

  }

  afterGetData(data){
    this.parseData();
    this.initAxis();
    this.heights = this.getHeightList(data);
    this.y_list = this.getYList(data);

  }

  getData(): void {
    this.barrasProvider.getData(this.parameters, this.uos)
      .subscribe(response => (this.data = response),
                 error => 'oioio',
                 () => this.afterGetData(this.data)
                );
  }

  updateData() : void {

       this.barrasProvider.getData(this.parameters, this.uos)
       .subscribe(response => (this.data = response),
                  error => 'oioio',
                  () => {
                    this.animateBars();
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

  getYList(data)
  {
    return data.map(d => this.getBarY(d.valor));
  }

  getTickYValue(d,i)
  {
    return this.dadosProvider.formatData(d3Scale.scaleLinear()
      .domain(d3.extent(this.yTicksArray))
      .range([this.minValue, this.maxValue])(i));
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

    if(typeof (this.parameters.ano) == "string")
      this.parameters.ano = parseInt(this.parameters.ano);

    let index_ano = this.keys.indexOf(this.parameters.ano);
    let valor = this.data[index_ano].valor;
    let percentual = this.data[index_ano].percentual;

    if(this.parameters.eixo == 2 && (this.parameters.var == 18 || this.parameters.var == 19))
    {
      percentual = 0;
      this.data.forEach(element => {
        percentual = percentual + element.valor;
      });
    }
    this.sendBarData(valor, percentual);

    let i = 0;
    let n_iteracoes = 25; //ideal que seja divisor de 100 ou 1000 (aumentando deixa mais smooth)

    this.initAxis();

    let new_height_list = this.getHeightList(this.data);
    let new_y_list = this.getYList(this.data)

    const interp_h = d3.interpolate(this.heights, new_height_list);
    const interp_y = d3.interpolate(this.y_list, new_y_list);

    let animation = setInterval(d => {

      this.heights = interp_h(i);
      this.y_list = interp_y(i);

      if (i >= 1){
        clearInterval(animation)
      }

      i  = i + 1/n_iteracoes ;
    }, this.interval_animation)

  }

  selectBar(ano){
    this.parameters.ano = ano;
  }

  getBarColor(d){
    if(this.parameters.ano == d.ano){
      return this.colors.eixo[this.parameters.eixo].color['1'];
    } else  return (this.colors['cadeias'][this.parameters.cad]['color']);
  }
}
