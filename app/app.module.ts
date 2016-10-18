import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';

import { AppComponent }  from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';

@NgModule({
  imports: [ BrowserModule, MaterialModule.forRoot(), AppRoutingModule ],
  declarations: [ AppComponent, routedComponents ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
