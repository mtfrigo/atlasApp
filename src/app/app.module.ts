import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { BarrasProvider } from '../providers/barras/barras';
import { DonutProvider } from '../providers/donut/donut';
import { LinhasProvider } from '../providers/linhas/linhas';
import { TreemapProvider } from '../providers/treemap/treemap';
import { JsonsProvider } from '../providers/jsons/jsons';
import { MapaProvider } from '../providers/mapa/mapa';
import { IndexPage } from '../pages/index';
import { DadosProvider } from '../providers/dados/dados';
import { EmpilhadasProvider } from '../providers/empilhadas/empilhadas';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    IndexPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    IndexPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarrasProvider,
    DonutProvider,
    LinhasProvider,
    TreemapProvider,
    JsonsProvider,
    MapaProvider,
    DadosProvider,
    EmpilhadasProvider
  ]
})
export class AppModule {}
