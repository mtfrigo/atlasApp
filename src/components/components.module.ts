import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';
import { LinhasComponent } from './linhas/linhas';
import { TreemapComponent } from './treemap/treemap';
import { MapaComponent } from './mapa/mapa';

@NgModule({
	declarations: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent,
    MapaComponent],
	imports: [IonicModule],
  exports: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent,
    MapaComponent]
})
export class ComponentsModule {}
