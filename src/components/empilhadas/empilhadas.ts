import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmpilhadasProvider } from '../../providers/empilhadas/empilhadas';
import { DadosProvider } from '../../providers/dados/dados';
import { JsonsProvider } from '../../providers/jsons/jsons';

import * as d3 from "d3";
import * as d3Scale from "d3-scale";
import { reduce } from 'rxjs/operator/reduce';

/**
 * Generated class for the EmpilhadasComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-empilhadas',
  templateUrl: 'empilhadas.html'
})
export class EmpilhadasComponent {

  width  : number = window.innerWidth*1;
  height : number = window.innerHeight*0.4;

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

  margin = {top: 0, right: window.innerWidth*0.15, bottom: 30, left: window.innerWidth*0.15};

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
  anos: any = [];
  ids: any = [];
  values: number[] = [];
  minValue: any;
  maxValue: any;

  barsHeight: any;
  barsWidth:any;

  valueByDeg: any = [];

  index = true;
  first_year: any;
  dataset: any;

  constructor(public navCtrl: NavController, private empilhadasProvider: EmpilhadasProvider, private dadosProvider: DadosProvider,private jsonsProvider: JsonsProvider) {
    this.view_title = 'Histograma empilhado'

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
    this.getData();
  }

  sendBarData(valor, percent,total) {
    this.dadoGlobal.emit({view: 'barras', valor: valor, percentual: percent, total: total});
  }


  getData(): void {
    this.empilhadasProvider.getData(this.parameters, this.uos)
      .subscribe(response => (this.data = response),
                 error => 'oioio',
                 () => this.afterGetData(this.data)
                );
  }

  afterGetData(data){
    this.parseData();
    this.initAxis();
    //this.heights = this.getHeightList(data);
    //this.y_list = this.getYList(data);

  }

  parseData(){
    this.anos = this.data.map( d => d.ano);
    this.ids = Object.keys(this.data[0].valores);

    this.values = [];
    var valuesByDeg = {};
    var dados = []
    var actualSubdeg = this.dadosProvider.getDegName(this.parameters.subdeg, this.parameters.deg);
    var somaDeg = 0;
    var actualDado = 0;
    var actualDadoSoma = 0;

    this.data.forEach(element => {
      var soma = 0;
      var obj = {};
      obj['ano'] = element.ano;

      this.ids.forEach(val => {


        obj[val] = element.valores[val];

        if(valuesByDeg[val] == undefined) valuesByDeg[val] = {};

        valuesByDeg[val][element.ano] = element.valores[val];

        if(this.parameters.ano ==  element.ano)
        {
          actualDadoSoma += element.valores[val];

          if(actualSubdeg == val)
            actualDado = element.valores[val];
        }

        if(this.parameters.ano)
          somaDeg += element.valores[val];

        soma += element.valores[val];

      })

      this.values.push(soma);
      dados.push(obj);

    });

    Object.keys(valuesByDeg).forEach(d => {
      this.valueByDeg.push(valuesByDeg[d])
    })

    this.dataset = d3.stack().keys(this.ids)(dados);
    var max_value = -1;
    this.dataset[this.dataset.length-1].forEach(function(d){
        max_value = Math.max(d[1], max_value);
    })

    this.first_year = this.anos[0];

    var edgeValues = d3.extent(this.values);

    this.maxValue = edgeValues[1];
    this.minValue = 0;

    //AQUI
    this.sendBarData(actualDado, actualDado/actualDadoSoma, somaDeg);


  }

  initAxis() {

    this.x = d3.scaleBand()
      .domain(this.anos)
      .rangeRound([0, this.barsWidth])
      .padding(0.1);

    this.y = d3Scale.scaleLinear()
      .rangeRound([this.barsHeight, 0])
      .domain([0, this.maxValue]).nice();

    this.yTicksScale = d3Scale.scaleLinear()
      .rangeRound([this.y(0), this.y(this.maxValue)])
      .domain(d3.extent(this.yTicksArray)).nice();

  }


  getBarsTransform()
  {
    return "translate(" + (this.margin.left+5) + "," + this.valueTop + ")";
  }

  getTickY(d, i){
    return 'translate(0, ' +  this.yTicksScale(d) + ')';
  }

  getTickX(d, i){
    return 'translate('+ this.x(d.ano) +', '+ this.barsHeight +')';
  }

  getTickYValue(d,i)
  {
    return d3Scale.scaleLinear()
      .domain(d3.extent(this.yTicksArray))
      .rangeRound([0, this.maxValue])(i);
  }

  getSubdeg(deg, d){

    return "teste";
  }

  getRectHeight(d){

    return Math.abs(this.y(d[1])-this.y(d[0]))
  }

  getRectDataValue(d){
    return Math.abs(d[0] - d[1])
  }

  getRectColor(color, i, d){

    if(d.data.ano == this.parameters.ano && this.dadosProvider.getDegId(0, color) == this.parameters.subdeg)
      return this.colors.eixo['1'].color['1'];

    return this.colors.deg[this.parameters.deg].subdeg[color];
  }

  empilhadaClick(deg, d)
  {
    this.parameters.ano = d.data.ano;
    //this.parameters.subdeg = i;

    this.parameters.subdeg = this.dadosProvider.getDegId(0, deg.key);

    console.log(deg.key, this.dadosProvider.getDegId(0, deg.key))
  }

}
