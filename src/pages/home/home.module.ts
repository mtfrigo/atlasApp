import { NgModule } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { HomePage } from './home';

import { IonicPageModule } from 'ionic-angular';
import { BarrasComponentModule } from '../../components/barras/barras.module';
import { DonutComponentModule } from '../../components/donut/donut.module';
import { TreemapComponentModule } from '../../components/treemap/treemap.module';
import { MapaComponentModule } from '../../components/mapa/mapa.module';
import { DadosComponentModule } from '../../components/dados/dados.module';
import { EmpilhadasComponentModule } from '../../components/empilhadas/empilhadas.module';
import { TreemapRegionComponentModule } from '../../components/treemap-region/treemap-region.module';



@NgModule({
	declarations: [ HomePage],
  imports: [
    BarrasComponentModule,
    DonutComponentModule,
    DadosComponentModule,
    TreemapComponentModule,
    FormsModule,
    MapaComponentModule,
    EmpilhadasComponentModule,
    TreemapRegionComponentModule,
    IonicPageModule.forChild(HomePage)
  ],
  exports: [
    HomePage
  ]
})
export class HomeComponentModule {}
