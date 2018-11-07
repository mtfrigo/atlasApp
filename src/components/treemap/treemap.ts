import { Component, Input, OnChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { TreemapProvider } from '../../providers/treemap/treemap';
import { Treemap } from '../../interfaces/treemap';
import { HierarchyRectangularNode } from 'd3';
import { JsonsProvider } from '../../providers/jsons/jsons';
import { DadosProvider } from '../../providers/dados/dados';
/**
 * Generated class for the TreemapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-treemap',
  templateUrl: 'treemap.html'
})
export class TreemapComponent implements OnChanges{

  width  : number = window.innerWidth*0.8;
  height : number = window.innerHeight*0.25;

  @Input() url : string;
  @Input() parameters : any;

  @Output() dadoGlobal = new EventEmitter();

  private ready = false;
  private data : Treemap[] = [];
  private subtitles_1 : Treemap[] = [];
  private subtitles_2 : Treemap[] = [];
  private colors;
  private treemapData : HierarchyRectangularNode<{}>;
  private fontSizeStd : number = 20;
  private titleSize : number = 8;

  treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([this.width, this.height])
        .round(true)
        .paddingInner(1);

  constructor(private treemapProvider : TreemapProvider,
              private jsonsProvider: JsonsProvider,
              private dadosProvider: DadosProvider) {
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

  sendTreemapData(valor, percent, total) {
    this.dadoGlobal.emit({view: 'treemap', valor: valor, percentual: percent , total: total});
  }

  getHierarchy(){
    let root = d3.hierarchy(this.data)
                .sum(this.sumBySize)
                .sort((a, b)=> b.height - a.height || b.value - a. value)
    return root;
  }

  sumBySize(d){
    return d.size;
  }

  getTranslate(d){
    return "translate("+d.x0+", "+d.y0+")";
  }

  getColorCadeia(d){
    return this.colors != undefined ? this.colors.cadeias[d.parent.data.colorId].color : 'black'
  }

  getFontSize(d){
    return this.fontSizeStd*d.data.percentual + 8;
  }

  testCondition(d){
    let marginX = this.width/150;
    let betweenLetters : number = 1; // number of pixels between each letter
    let textLength : number = 0.45*(this.titleSize)*(d.data.name.length) + betweenLetters*(d.data.name.length-1)
    if((textLength + marginX)/(d.x1 - d.x0) > 1)
      return false
    else
      return true

  }

  formatPercent(percentual : string){
    let value : number  = parseFloat(percentual)*100
    return value.toFixed(2).toString() + '%'
  }

  textX(x1, x0){
    return x1 - x0 - (this.width)/200;
  }

  textY(y1, y0){
    return y1 - y0 - (this.height)/100;
  }

  selectCad(d){
    this.parameters.cad = d.parent.data.colorId; 
  }

  getData(): void {

    this.treemapProvider.getData(this.url)
        .subscribe(data => {
          this.data = data;
          this.updateGlobalData();
          this.treemapData = this.treemap(this.getHierarchy());
          this.ready = true;
          this.subtitles_1 = this.data['children']
                                  .filter((d, i) => {
                                    if(i < Math.floor(this.data['children'].length / 2)) return d;
                                  });
          this.subtitles_2 = this.data['children']
                                  .filter((d, i) => {
                                    if(i >= Math.floor(this.data['children'].length / 2)) return d;
                                  });
        });
  }

  getSubtitleStyle(d){
    return {
      'background-color': this.colors.cadeias[d.colorId].color,
      'width': '10px',
      'height': '10px',
      'margin-top': '3px'
    }
  }

  getOpacity(d){
    if(this.parameters.cad == 0) return 1
    if(this.parameters.cad == d.parent.data.colorId) return 1
    else return 0.8;
  }

  updateGlobalData(): void {

    var that = this;
    var filtered = this.data['children'].filter(function (obj) {
      return obj['colorId'] == that.parameters['cad'];
    });

    var total = 0;

    this.data['children'].forEach(element => {
      if(element.colorId != 0){
        total += parseInt(element['children'][0]['children'][0].size);
      }
    });

    if(this.parameters['cad'] != 0){
      this.sendTreemapData(filtered[0]['children'][0]['children'][0].size, filtered[0]['children'][0]['children'][0].percentual, total)
    }
    else {
      this.sendTreemapData(0, 1, 0)
    }

    //this.dadosProvider.setGlobalData('treemap', this.new_data[this.parameters.ano - 2007].valor, this.new_data[0].percentual);

  }

}
