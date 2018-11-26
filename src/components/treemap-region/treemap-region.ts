import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { TreemapRegionProvider } from '../../providers/treemap-region/treemap-region';
import { Treemap } from '../../interfaces/treemap';
import { HierarchyRectangularNode } from 'd3';
import { JsonsProvider } from '../../providers/jsons/jsons';

/**
 * Generated class for the TreemapRegionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-treemap-region',
  templateUrl: 'treemap-region.html'
})
export class TreemapRegionComponent implements OnChanges{
  width  : number = window.innerWidth*0.8;
  height : number = window.innerHeight*0.25;
  @Input() url : string;
  @Input() parameters : any;
  protected ready = false;
  private data : Treemap[] = [];
  private colors;
  protected treemapData : HierarchyRectangularNode<{}>;
  private fontSizeStd : number = 20;
  private titleSize : number = 8;

  treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([this.width, this.height])
        .round(true)
        .paddingInner(1);

  constructor(private treemapProvider : TreemapRegionProvider,
              private jsonsProvider: JsonsProvider) {
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
    if(d.data.id == this.parameters.uf) return this.colors.eixo[this.parameters.eixo].color['1'];
    else return this.colors != undefined ? this.colors.regioes[d.parent.parent.data.colorId].color : 'black'
  }
  textX(x1, x0){
    return x1 - x0 - (this.width)/200;
  }

  textY(y1, y0){
    return y1 - y0 - (this.height)/100;
  }

  click(d){
    this.parameters.uf = d.data.id;
  }

  getData(): void {

    this.treemapProvider.getData(this.url)
        .subscribe(data => {
          this.data = data;
          //this.updateGlobalData();
          this.treemapData = this.treemap(this.getHierarchy());
          this.ready = true;
        });
  }

  getFontSize(d){
    return this.fontSizeStd*d.data.percentual + 8;
  }

  formatPercent(percentual : string){
    let value : number  = parseFloat(percentual)*100
    return value.toFixed(2).toString() + '%'
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
}
