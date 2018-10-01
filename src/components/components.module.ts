import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';
import { TreemapComponent } from './treemap/treemap';

@NgModule({
	declarations: [BarrasComponent, DonutComponent,
    TreemapComponent],
	imports: [IonicModule],
	exports: [BarrasComponent, DonutComponent,
    TreemapComponent]
})
export class ComponentsModule {}
