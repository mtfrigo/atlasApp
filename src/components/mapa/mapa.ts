import { Component, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import * as d3 from 'd3';

import * as t from "topojson-client";

import { MapaProvider } from '../../providers/mapa/mapa';
import { JsonsProvider } from '../../providers/jsons/jsons';


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
  @Input() width  : number = window.innerWidth*0.9;
  @Input() height : number = this.width;

  view_title: any;

  margin = {top: 0, right: 0, bottom: 0, left: 0};
  mapWidth: any;
  mapHeight: any;

  data = [];
  info: any;
  colors: any;
  brStates: any;

  projection: any;
  path: any;

  states: any;

  values: number[] = [];
  minValue: number;
  maxValue: number;

  colorScale: any;

  cads_index: any = 0;
  cads = [0, 5,6,8];

  constructor(public navCtrl: NavController, private mapaProvider: MapaProvider, private jsonProvider: JsonsProvider) {

    this.mapHeight = this.height - this.margin.top - this.margin.bottom;
    this.mapWidth = this.width - this.margin.left - this.margin.right;

    this.view_title = "Mapa do Brasil"
  }

  ngOnInit() {

    this.jsonProvider.getColors()
      .subscribe(d=>{
        this.colors = d;
    })

    this.jsonProvider.getBrStates()
      .subscribe(d=>{
        this.brStates = d;
        this.getData();

    })

  }


  getData(): void {


    this.mapaProvider.getData(this.cads[this.cads_index])
      .subscribe(response => (this.data = response),
                 error => '[MAPA] ERRO!',
                 () => this.afterGetData()
                );
  }

  updateData(): void {

    if(this.cads_index++ >= this.cads.length -1) this.cads_index = 0;

    this.mapaProvider.getData(this.cads[this.cads_index])
      .subscribe(response => (this.data = response),
                 error => '[MAPA] ERRO!',
                 () => this.afterGetData()
                );
  }



  getMapTransform()
  {
    return "translate(" + (this.margin.left+5) + "," + (this.margin.top+5) + ")";
  }

  afterGetData(){

    this.projection = d3.geoMercator()
                        .rotate([4.4, 0])
                        .scale(100)

    this.path = d3.geoPath()
                .projection(this.projection);

    this.states = t.feature(this.brStates, this.brStates.objects.states);

    this.projection.fitExtent([[0,0],[this.mapWidth, this.mapHeight]], this.states);

    this.parseData();
  }

  parseData()
  {
    this.values = this.data.pop();

    var edgeValues = d3.extent(this.values);
    this.maxValue = edgeValues[1];
    this.minValue = edgeValues[0];

    var info = {};
    this.data.forEach(function(d) {
      info[d.id] = d;
    })
    this.info = info;



    this.colorScale = d3.scaleLinear()
      .domain([this.minValue, this.maxValue])
      .range([this.colors.cadeias[0].gradient['2'], this.colors.cadeias[0].gradient['6']])

  }

  getStateColor(d){
    return this.colorScale(this.info[d.id].valor);
  }

  update(){
    this.updateData()
  }

}
