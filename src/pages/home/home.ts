import { Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import { JsonsProvider } from '../../providers/jsons/jsons';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  private list_uf : Object = [];
  private pt_br : any = [];
  private anos : number[];
  private pre_desags : number = 0;
  private select_desags : any = [];
  private cads : any[];
  private ready_pt_br : boolean = false;
  private globalData : Object = [];
  private parameters = {
    'uf': 0,
    'var': 1,
    'eixo': 1,
    'ano': 0,
    'cad': 0,
    'deg': 0,
    'subdeg': 0,
    'chg': 0,
    'slc': 0
  };

  portes = [
    {"name": "Escolher", "value": 0},
    {"name": "Porte Micro", "value": 9}, 
    {"name": "Porte Pequeno", "value": 10}, 
    {"name": "Porte Médio", "value": 11}, 
    {"name": "Porte Grande", "value": 12}
  ]

  constructor(public navCtrl: NavController, private jsonsProvider : JsonsProvider) {

  }

  ngOnInit(){
    this.jsonsProvider.getUfJson()
        .subscribe( d => {
          this.list_uf = d;
        })

    this.jsonsProvider.getPTBR()
      .subscribe( d => {
        this.pt_br = d;
        this.ready_pt_br = true;
        this.cads = d['select']['cad'];
      })

    this.jsonsProvider.getSelectDesags()
      .subscribe( d => {
        this.select_desags = d;
      })
    
    this.jsonsProvider.getAnos(this.parameters.eixo)
      .subscribe(d => {
        this.anos = d;
        this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
      })


  }


  update(event){
    this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
    this.parameters.uf  = 0;
  }

  updateDesag(event){
    this.parameters.deg = Math.floor(this.pre_desags/10);
    this.parameters.subdeg = this.pre_desags % 10;
  }

  getQuery(parameters : Object){
    return Object.keys(parameters)
                 .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(parameters[k])
                  })
                  .join('&');
  }

  private getDataVar(){
    return this.pt_br.var[this.parameters.eixo].filter( obj => {
        return obj.id == this.parameters.var;
    })[0];
  }

  correctView(box: number, view : string) : boolean {
    let views = this.getDataVar().views;
    switch(box){
      case 1:
        if(views.view_box1[this.parameters.chg].id == view)
          return true; 
        else 
          return false;
      case 2: 
        if(views.view_box2[0].id == view)
          return true; 
        else 
          return false;
      case 3: 
        if(views.view_box3[0].id == view)
          return true; 
        else 
          return false;
    }
  }

  vrvPorte(){
    let vrvPorte = [1, 2, 3];
    if(vrvPorte.indexOf(this.parameters.var) != -1)
      return true;
    else 
      return false;
  }
}

