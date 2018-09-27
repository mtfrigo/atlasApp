import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';

@NgModule({
	declarations: [BarrasComponent, DonutComponent],
	imports: [IonicModule],
	exports: [BarrasComponent, DonutComponent]
})
export class ComponentsModule {}
