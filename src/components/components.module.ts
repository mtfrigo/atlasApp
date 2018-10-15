import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';
import { LinhasComponent } from './linhas/linhas';
import { TreemapComponent } from './treemap/treemap';
import { MapaComponent } from './mapa/mapa';
import { DadosComponent } from './dados/dados';

@NgModule({
	declarations: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent,
    MapaComponent,
    DadosComponent],
	imports: [IonicModule],
  exports: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent,
    MapaComponent,
    DadosComponent]
})
export class ComponentsModule {}
