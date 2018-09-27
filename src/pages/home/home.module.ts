import { NgModule } from '@angular/core';
import { HomePage } from './home';

import { IonicPageModule } from 'ionic-angular';
import { BarrasComponentModule } from '../../components/barras/barras.module';
import { DonutComponentModule } from '../../components/donut/donut.module';



@NgModule({
	declarations: [ HomePage],
  imports: [BarrasComponentModule, DonutComponentModule, IonicPageModule.forChild(HomePage)],
  exports: [
    HomePage
  ]
})
export class HomeComponentModule {}
