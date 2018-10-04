import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';
import { LinhasComponent } from './linhas/linhas';
import { TreemapComponent } from './treemap/treemap';

@NgModule({
	declarations: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent],
	imports: [IonicModule],
  exports: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent,
    TreemapComponent]
})
export class ComponentsModule {}
