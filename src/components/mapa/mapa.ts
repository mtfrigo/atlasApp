import { Component, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import * as d3 from 'd3';

import * as t from "topojson-client";

import { MapaProvider } from '../../providers/mapa/mapa';
import { JsonsProvider } from '../../providers/jsons/jsons';
import { DadosProvider } from '../../providers/dados/dados';


/*
 * Generated class for the MapaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-mapa',
  templateUrl: 'mapa.html'
})
export class MapaComponent {

  @Input() width  : number;
  @Input() height : number;

  @Input() parameters : any;
  @Input() url : string;

  view_title: any;

  margin = {top: 0, right: 0, bottom: 5, left: 0};
  mapWidth: any;
  mapHeight: any;

  data = [];
  info: any;
  colors: any;
  brStates: any;

  projection = d3.geoMercator()
                  .rotate([4.4, 0])
                  .scale(100);

  path = d3.geoPath()
            .projection(this.projection);

  paths : string[];

  states: any;

  values: number[] = [];
  legend_data : string[] = [];

  legend_config : any;

  minValue: number;
  maxValue: number;

  colorScale: any;


  constructor(public navCtrl: NavController, private mapaProvider: MapaProvider, private dadosProvider :DadosProvider, private jsonProvider: JsonsProvider) {

    this.view_title = "Mapa do Brasil";
  }

  ngOnInit() {


    this.mapHeight = this.height - this.margin.top - this.margin.bottom;
    this.mapWidth = this.width - this.margin.left - this.margin.right;

    this.legend_config = {
      'width':  this.width*0.35,
      'height': this.height*0.03,
      'x':      this.width*0.01,
      'y':      this.height*0.75
    }

    this.jsonProvider.getColors()
      .subscribe(d=>{
        this.colors = d;

    this.jsonProvider.getBrStates()
    .subscribe(d=>{
        this.brStates = d;
        this.getData();
      })
    })
  }

  ionViewDidEnter(){

  }

  ngOnChanges(){
    this.updateData();
  }


  getData(): void {

    this.mapaProvider.getData(this.url)
      .subscribe(response => (this.data = response),
                 error => '[MAPA] ERRO!',
                 () => this.afterGetData()
                );
  }

  updateData(): void {
    this.mapaProvider.getData(this.url)
      .subscribe(response => (this.data = response),
                 error => '[MAPA] ERRO!',
                 () => this.parseData()
                );
  }

  getMapTransform(){
    return "translate(" + (this.margin.left+5) + "," + (this.margin.top+5) + ")";
  }

  afterGetData(){

    this.states = t.feature(this.brStates, this.brStates.objects.states);

    this.projection.fitExtent([[0,0],[this.mapWidth, this.mapHeight]], this.states);
    this.paths = this.states.features.map(d => this.path(d));

    this.parseData();
  }

  parseData()
  {
    this.values = this.data.pop();
    this.values.splice(this.values.length -1, 1)
    var edgeValues = d3.extent(this.values);
    this.maxValue = edgeValues[1];
    this.minValue = edgeValues[0];
    var info = {};
    this.data.forEach(function(d) {
      info[d.id] = d;
    })
    this.info = info;

    this.legend_data = [String(this.dadosProvider.formatData(this.minValue, this.parameters)),
                        String(this.dadosProvider.formatData(0.5*(this.maxValue+this.minValue), this.parameters)),
                        String(this.dadosProvider.formatData(this.maxValue, this.parameters))];

    if(this.colors)
    this.colorScale = d3.scaleLinear()
      .domain([this.minValue, this.maxValue])
      .range([this.colors.cadeias[this.parameters['cad']].gradient['2'], this.colors.cadeias[this.parameters['cad']].gradient['6']])

  }

  selectUF(uf){
    this.parameters.uf = uf;
  }

  getStateColor(d){

    function filterByID(obj) {
      if ('id' in obj && typeof(obj.id) === 'number' && !isNaN(obj.id) && obj.id == d.id) {
        return true;
      }
    }

    if(this.parameters.eixo == 2 && this.parameters.var == 17)
    {
      var state = this.data.filter(filterByID);
      if(this.colors.binario[state[0]['SouN']]) return this.colors.binario[state[0]['SouN']].color;
    }
    else
    {
      if(this.parameters.uf == d.id)
        return this.colors.eixo[this.parameters.eixo].color['1'];
      else
        return this.colorScale(this.info[d.id].valor);
    }



  }


}
