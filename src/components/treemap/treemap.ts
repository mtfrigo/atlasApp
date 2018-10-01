import { Component, Input } from '@angular/core';
import * as d3 from 'd3';
import { TreemapProvider } from '../../providers/treemap/treemap';
import { Treemap } from '../../interfaces/treemap';
import { HierarchyRectangularNode } from 'd3';
import { JsonsProvider } from '../../providers/jsons/jsons';
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
export class TreemapComponent {

  @Input() width  : number = 500;
  @Input() height : number = 500;
  private ready = false;
  private data : Treemap[] = [];
  private colors;
  private treemapData : HierarchyRectangularNode<{}>;
  private center : string = `translate(${this.width/2}, ${this.height/2})`;
  private fontSizeStd : number = 50;
  private titleSize : number = 10;
  treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([this.width, this.height])
        .round(true)
        .paddingInner(1);


  constructor(private treemapProvider : TreemapProvider,
              private jsonsProvider: JsonsProvider) {}

  ngOnInit() {
    this.jsonsProvider.getColors()
      .subscribe(d=>{
        this.colors = d;
        this.getData();
    })
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
    return this.colors.cadeias[d.parent.data.colorId].color
  }

  getFontSize(d){
    return this.fontSizeStd*d.data.percentual + 10;
  }

  testCondition(d){
    let marginX = this.width/150;
    let betweenLetters : number = 1; // number of pixels between each letter
    let textLength : number = 0.5*(this.titleSize)*(d.data.name.length) + betweenLetters*(d.data.name.length-1)
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

  getData(): void {
    this.treemapProvider.getData()
        .subscribe(data => {
          this.data = data;
          this.treemapData = this.treemap(this.getHierarchy())
          this.ready = true;
        });
  }

}
