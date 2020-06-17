import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { DDMTLibModule } from '../../../ddmt-lib/src/lib/ddmt-lib.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DDMTLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
