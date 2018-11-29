import { NgModule } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { HomePage } from './home';

import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
	declarations: [ HomePage],
  imports: [
    FormsModule,
    ComponentsModule,
    IonicPageModule.forChild(HomePage)
  ],
  exports: [
    HomePage
  ]
})
export class HomeComponentModule {}
