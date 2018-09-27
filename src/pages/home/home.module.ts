import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { BarrasComponentModule } from '../../components/barras/barras.module';

@NgModule({
	declarations: [ HomePage],
	imports: [BarrasComponentModule]
})
export class HomeComponentModule {}
