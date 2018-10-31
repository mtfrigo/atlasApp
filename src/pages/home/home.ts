import { Component, OnInit, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { JsonsProvider } from '../../providers/jsons/jsons';
import { DadosProvider } from '../../providers/dados/dados';
import { ObserveOnMessage } from 'rxjs/operators/observeOn';
import { BehaviorSubject } from 'rxjs';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  @ViewChild(Slides) slides: Slides;

  private list_uf : any = [];
  public pt_br : any = [];
  private anos : number[];
  private pre_desags : number = 0;
  private select_desags : any = [];
  private cads : any[];
  private ready_pt_br : boolean = false;
  private info_eixo = {'value': 0, 'name': '', 'color': '#fff', 'ioncolor': 'eixo1'};
  data: any;
  i = 0;

  view: string = '0';
  menu_plus: string = '+';
  menu_opacity = 0.8;
  menu_color: string = "rgba(233, 242, 236, 0.315)";
  expand: boolean = false;

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
    'mundo': 0
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

  segmentChanged(slide, index){
    this.slides.slideTo(index, 500);
  }

  slideChanged() {
    var slideIndex = this.slides.getActiveIndex();

    if(slideIndex >= 0 && slideIndex <= 2)  this.view = slideIndex.toString();
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
    this.dadosProvider.setGlobalData(dadoGlobal);
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

  getTitleView(box: number){
    let views = this.getDataVar().views;
    let title : string = '';
    let uf : string = '';
    let cad: string = '';
    let prep_uf : string = '';
    let prep_cad: string = '';

    switch(box){
      case 1:
        title = views.view_box1[this.parameters.chg].title; break;
      case 2:
        title = views.view_box2[0].title; break;
      case 3:
        title = views.view_box3[0].title;
    }
    uf = this.list_uf.filter( d => d.id == this.parameters.uf)[0].name.toUpperCase();
    prep_uf = this.list_uf.filter( d => d.id == this.parameters.uf)[0].prep.toUpperCase();

    cad = this.pt_br.select.cad[this.parameters.cad].name.toUpperCase();
    prep_cad = 'NO SETOR';

    if(this.parameters.uf == 0){
      uf = "BRASIL"
    }

    if(this.parameters.cad == 0){
      cad = "SETORES CULTURAIS E CRIATIVOS"
      prep_cad = "NOS"
    }

    title = title.replace('[uf]', prep_uf+' '+uf);
    title = title.replace('[cad]', prep_cad+' '+cad)

    return title
  }

  getDescVar(){
    return this.getDataVar().desc;
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

  getDisplay(){
    if(this.expand){
      return 'none'
    }
    else return 'flex';
  }

  menuClick(){
    if(this.expand == true)
    {
      this.menu_color = "#E9F2ED";
      this.expand = false;
      this.menu_plus = '+';
      this.menu_opacity = 0.8;
    }
    else
    {
      this.menu_color = "#DDDEDE";
      this.expand = true;
      this.menu_plus = '-';
      this.menu_opacity = 1;
    }
  }
}

