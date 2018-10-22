import { Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { JsonsProvider } from '../../providers/jsons/jsons';
import { DadosProvider } from '../../providers/dados/dados';
import { ObserveOnMessage } from 'rxjs/operators/observeOn';
import { BehaviorSubject } from 'rxjs';

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
  private info_eixo = {'value': 0, 'name': ''};
  data: any;

  private parameters = {
    'uf': 0,
    'var': 1,
    'eixo': 1,
    'ano': 0,
    'cad': 0,
    'deg': 0,
    'subdeg': 0,
    'chg': 0,
    'slc': 0,
    'prc': 0,
    'typ': 1,
    'mundo': 1
  };


  portes = [
    {"name": "Escolher", "value": 0},
    {"name": "Porte Micro", "value": 9},
    {"name": "Porte Pequeno", "value": 10},
    {"name": "Porte Médio", "value": 11},
    {"name": "Porte Grande", "value": 12}
  ]

  parceiros = [
    {"name": "Mundo", "value": 0},
    {"name": "África", "value": 1},
    {"name": "América do Norte", "value": 2},
    {"name": "América do Sul", "value": 3},
    {"name": "Europa", "value": 4},
    {"name": "Oceania", "value": 5}
  ]

  constructor(public navCtrl: NavController, 
    private jsonsProvider : JsonsProvider, 
    private dadosProvider : DadosProvider,
    public navParams : NavParams) {
      this.info_eixo = navParams.get('data');
      this.parameters.eixo = this.info_eixo.value;
  }

  ngOnInit(){

    this.data = new BehaviorSubject(this.getGlobalData());

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

  getGlobalData(){
    return this.dadosProvider.getGlobalData();
  }

  reciverData(dadoGlobal) {
    this.dadosProvider.setGlobalData(dadoGlobal.view, dadoGlobal.valor, dadoGlobal.percentual);
    this.data.next(this.getGlobalData());
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

        if(this.parameters.eixo == 1 && this.parameters.var != 4 && this.parameters.var != 5 && this.parameters.var != 6 && this.parameters.deg != 0){
          if(view == 'empilhadas')
            return true;
          else
            return false;
        }

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

  getUos(box: number){
    switch(this.parameters.eixo){
      case 0:
        if(this.parameters.var >= 10){
          if(box == 2) return 1;
        }
        return 0;
      case 1:

        if(this.parameters.var > 11){
          if(box == 2) return 1;
        } else if(this.parameters.var == 6){
          if(box == 3) return 1;
        }

        return 0;

      case 2:
        if(this.parameters.var == 15 || this.parameters.var == 16){
          if(box == 2) return 1;
        } else if(this.parameters.var == 10){
          if(box == 1) return 0;
        }
        return 0;

      case 3:
        if(this.parameters.var == 5 || this.parameters.var == 8){
          if(box == 1) return 1;
          if(box == 2) return 0;
          if(box == 3) return 2;
        }

        return 0;
    }
  }

  selectTipos(){
    let selects = [
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2}
      ],
      [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      [
        {"name": "Exportação", "value": 1}
      ]
    ]

    return selects[this.parameters.var - 1];
  }
}

