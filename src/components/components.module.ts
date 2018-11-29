import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';
import { LinhasComponent } from './linhas/linhas';
import { TreemapComponent } from './treemap/treemap';
import { MapaComponent } from './mapa/mapa';
import { DadosComponent } from './dados/dados';
import { EmpilhadasComponent } from './empilhadas/empilhadas';
import { MapaMundiComponent } from './mapa-mundi/mapa-mundi';
import { TreemapRegionComponent } from './treemap-region/treemap-region';
import { SelectAtlasComponent } from './select-atlas/select-atlas';

@NgModule({
	declarations: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent,
    MapaComponent,
    DadosComponent,
    EmpilhadasComponent,
    MapaMundiComponent,
    TreemapRegionComponent,
    SelectAtlasComponent],
	imports: [IonicModule],
  exports: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent,
    MapaComponent,
    DadosComponent,
    EmpilhadasComponent,
    MapaMundiComponent,
    TreemapRegionComponent,
    SelectAtlasComponent]
})
export class ComponentsModule {}
