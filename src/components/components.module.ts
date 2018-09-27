import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { DonutComponent } from './donut/donut';
@NgModule({
	declarations: [BarrasComponent, DonutComponent],
	imports: [],
	exports: [BarrasComponent, DonutComponent]
})
export class ComponentsModule {}
