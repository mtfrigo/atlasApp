

import { NgModule } from '@angular/core';
import { IndexPage } from './index';

import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    IndexPage,
  ],
  imports: [
    IonicPageModule.forChild(IndexPage),
  ],
  exports: [
    IndexPage
  ]
})
export class IndexPageModule {}
