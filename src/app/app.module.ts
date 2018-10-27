import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VatModule } from "./vat/vat.module";
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { LoginComponent } from "./login/login.component";
import {
    MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSortModule, MatTableModule
} from "@angular/material";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    FormsModule,
    VatModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '/'
  }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
