import { NgModule } from '@angular/core';
import { BarrasComponent } from './barras/barras';
import { IonicModule } from 'ionic-angular';
import { DonutComponent } from './donut/donut';
import { LinhasComponent } from './linhas/linhas';

@NgModule({
	declarations: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent],
	imports: [IonicModule],
  exports: [
    BarrasComponent,
    DonutComponent,
    LinhasComponent]
})
export class ComponentsModule {}
