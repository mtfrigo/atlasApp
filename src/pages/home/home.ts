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
  private desags : any = [];
  private cads : any[];
  private ready_pt_br : boolean = false;
  private info_eixo = {'value': 0, 'name': '', 'color': '#fff', 'ioncolor': 'eixo1'};
  data: any;
  i = 0;

  view: string = '0';
  menu_plus: string = '+';
  menu_opacity = 0.8;
  menu_color: string = "#ffffff";
  expand: boolean = false;

  private parameters = {
    'uf': 0,
    'var': 1,
    'eixo': 1,
    'ano': 0,
    'cad': 0,
    'deg': 0,
    'subdeg': 0,
    'mec': 0,
    'mod': 0,
    'pfj': 0,
    'ocp': 0,
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

  mecanismos = [
    {"name": "Todos", "value": 0},
    {"name": "FNC", "value": 1},
    {"name": "Mecenato", "value": 2},
    {"name": "Fundo Cultural", "value": 3},
    {"name": "Outros", "value": 4},
  ]

  pessoas = [
    {"name": "Todos", "value": 0},
    {"name": "Pessoa Física", "value": 1},
    {"name": "Pessoa Jurídica", "value": 2},
  ]

  modalidades = [
    {"name": "Todos", "value": 0},
    {"name": "Direta", "value": 1},
    {"name": "Indireta", "value": 2},
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
      if(this.parameters.eixo == 3){
        this.parameters.slc = 1;
      }
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
        this.desags = d;
        this.select_desags = this.desags[0];
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
    let ocp_default = { 1: 3, 2: 3, 4: 1, 5: 1, 6: 1, 7: 3, 9: 0, 11: 0, 12: 3, 13: 3, 14: 3, 15: 3 }

    if(this.parameters.eixo == 1){

      if(this.parameters.ocp == 0)
        this.select_desags = this.desags[1];
      else
        this.select_desags = this.desags[0];

      if(ocp_default[this.parameters.var] == 0){
        this.parameters.slc = 0;
      }
      if(this.parameters.slc == 1){
        this.parameters.ocp = ocp_default[this.parameters.var];
      } else {
        this.parameters.ocp = 0;
      }
    }
    else if(this.parameters.eixo == 2)
    {
      this.parameters.slc = 0;
      this.getMecDefault();

      this.getCads();

    }
    else if(this.parameters.eixo == 3){
      if(!this.hasConsumo()) this.parameters.slc = 1
    }

    if(this.parameters.eixo == 2 && this.parameters.var == 17)
    {
      let anosAux = this.anos[this.parameters.var][this.parameters.slc];
      anosAux.pop();
      this.parameters.ano = Math.max.apply(null, anosAux);
    }
    else{
      this.parameters.ano = Math.max.apply(null, this.anos[this.parameters.var][this.parameters.slc]);
    }

    this.resetParameters();
  }

  hasUf(){
    if(this.parameters.eixo == 2)
    {
      if(this.parameters.var == 10 || this.parameters.var == 16 || this.parameters.var == 15)
        return false;
      else
        return true;
    }
    else return true;
  }

  getCads(){

    if(this.parameters.eixo == 2)
    {
      if(this.parameters.var == 18)
      {
        this.cads = [
          {"name":"Todos","value":"0"},
          {"name":"Artes Cênicas e Espetáculos","value":"2"},
          {"name":"Audiovisual", "value":"3"},
          {"name":"Cultura Digital","value":"4"},
          {"name":"Editorial","value":"5"},
          {"name":"Educação e Criação em Artes","value":"6"},
          {"name":"Música","value":"8"},
          {"name":"Patrimônio","value":"9"}
        ]
      }
      else if(this.parameters.var == 19)
      {
        this.cads = [
          {"name":"Todos","value":"0"},
          {"name":"Artes Cênicas e Espetáculos","value":"2"},
          {"name":"Audiovisual", "value":"3"},
          {"name":"Editorial","value":"5"},
          {"name":"Música","value":"8"},
          {"name":"Outros","value":"11"}
        ]
      }
      else if(this.parameters.var == 15 || this.parameters.var == 16  || this.parameters.var == 10 || this.parameters.var == 17)
      {
        this.cads = [
          {"name":"Todos","value":"0"}
        ]
      }
      else
        this.cads = this.pt_br['select']['cad'];
    }

  }

  getMecDefault(){

    if(this.parameters.var == 7 || this.parameters.var == 11 || this.parameters.var == 12 || this.parameters.var == 13 || this.parameters.var == 14)
      this.parameters.mec = 2;
    else
      this.parameters.mec = 0;
  }

  hasMec(){

    if(this.parameters.eixo == 2)
    {
      if(this.parameters.var == 3)
      {
        this.mecanismos = [
          {"name": "Todos", "value": 0},
          {"name": "Fundo Cultural", "value": 3},
          {"name": "Outros", "value": 4},
        ];

        return true;
      }
      else if(this.parameters.var == 1 || this.parameters.var == 8 || this.parameters.var == 9 || this.parameters.var == 15 || this.parameters.var == 16)
      {
        this.mecanismos = [
          {"name": "Todos", "value": 0},
          {"name": "FNC", "value": 1},
          {"name": "Mecenato", "value": 2},
        ];

        return true;
      }
      else if(this.parameters.var == 17)
      {
        this.mecanismos = [
          {"name": "Mecenato Estadual", "value": 0},
          {"name": "Editais Estaduais", "value": 1},
        ];
        return true;
      }


    }
    else
      return false;

  }

  hasMod(){

    if(this.parameters.eixo == 2 && this.parameters.var == 3)
    {
      return true;
    }
    else
    {
      return false;
    }

  }

  resetParameters(){
    this.parameters.uf  = 0;
    this.parameters.cad  = 0;
    this.parameters.prc = 0;
    this.parameters.mundo = 0;
    this.parameters.chg = 0;
    this.parameters.deg = 0;
    this.parameters.subdeg = 0;
    this.parameters.mec = 0;
    this.parameters.mod = 0;
  }

  isIHHC4(){
    let isIHHC4 = [
      [10, 11, 12, 13],
      [12, 13, 14, 15],
      [15, 16],
      [5, 8]
    ]

    if(isIHHC4[this.parameters.eixo].indexOf(this.parameters.var) == -1)
      return false;
    else
      return true;
  }

  disableButton(){
    let vars_enabled = [];
    switch(this.parameters.eixo){
      case 0:
        vars_enabled = [1, 4, 5, 6, 7, 8];
        if(vars_enabled.indexOf(this.parameters.var) == -1){
          return true;
        } else {
          return false;
        }
      case 3:
        vars_enabled = [1, 2, 3, 13];
        if(vars_enabled.indexOf(this.parameters.var) == -1){
          return true;
        } else {
          return false;
        }
    }
  }

  hasPfj(){

    if(this.parameters.eixo == 2 && this.parameters.var == 4)
      return true;
    else
    {
      this.parameters.pfj = 0;
      return false;
    }

  }

  event_mod(event){
    if(this.parameters.eixo == 2 && this.parameters.var == 3){
      if(this.parameters.mod != 0) this.parameters.mec = 0;
    }
  }

  event_mec(event){
    if(this.parameters.eixo == 2 && this.parameters.var == 3){
      if(this.parameters.mec != 0) this.parameters.mod = 0;
    }
  }

  hasOcp(){

    let ocp_default = { 1: 3, 2: 3, 4: 1, 5: 1, 6: 1, 7: 3, 9: 0, 11: 0, 12: 3, 13: 3, 14: 3, 15: 3 }

    if(this.parameters.eixo == 1 && ocp_default[this.parameters.var] == 0){
      this.parameters.slc = 0;
      return false;
    }
    return true;

  }

  hasTrabRec()
  {
    if(this.parameters.var == 18 || this.parameters.var == 19)
    {
      return true;
    }
  }

  viewButton(){
    if(this.parameters.eixo == 3){
      if(this.parameters.mundo == 0){
        return 'Brasil'
      } else {
        return 'Mundo'
      }
    } else {
      if(this.parameters.chg == 0){
        return 'Treemap'
      } else {
        return 'Mapa'
      }
    }
  }

  hasConsumo(){
    if(this.parameters.eixo == 3){
      switch(this.parameters.var){
        case 1: ;
        case 2: ;
        case 3: ;
        case 5: ;
        case 8: return true;
      }
    }
    return false;

  }


  changeView(event){
    this.parameters.chg = this.parameters.chg == 0? 1 : 0;
  }


  hasTreemapRegion(){
    if(this.parameters.eixo == 0){
      switch(this.parameters.var){
        case 1: ;
        case 2: ;
        case 3: ;
        case 4: ;
        case 5: return true;
      }
    }

    return false;

  }

  updateDesag(event){
    this.parameters.deg = Math.floor(this.pre_desags/10);
    this.parameters.subdeg = this.pre_desags % 10;
  }

  updateCad(event){
    this.parameters.cad = 0;
  }

  updateMundo(event){
    this.parameters.mundo = this.parameters.mundo == 0 ? 1 : 0;
    this.parameters.chg = this.parameters.mundo;
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

  getOcpSelect(){
    let ocp_data = [
      {'name': 'Todos', 'value': 3},
      {'name': 'Atividades Relacionadas', 'value': 1},
      {'name': 'Cultura', 'value': 2}
    ]

    let ocp_default = { 1: 3, 2: 3, 4: 1, 5: 1, 6: 1, 7: 3, 9: 0, 11: 0, 12: 3, 13: 3, 14: 3, 15: 3 }


    return ocp_data.filter(d => {
      if(ocp_default[this.parameters.var] == 3)
        return d;
      else if(d.value != 3) return d;
    });

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
        }
        else if(this.parameters.var == 10){
          if(box == 2) return 1;
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
    let selects = {
      1: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      2: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2}
      ],
      3: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      5: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      8: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      11: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2}
      ],
      12: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2}
      ],
      13: [
        {"name": "Exportação", "value": 1},
        {"name": "Importação", "value": 2},
        {"name": "Saldo Comercial", "value": 3},
        {"name": "Corrente de Comércio", "value": 4}
      ],
      14: [
        {"name": "Exportação", "value": 1}
      ]
    }

    return selects[this.parameters.var];
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
      this.menu_color = "#ffffff";
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

