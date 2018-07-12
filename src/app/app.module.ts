import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    BrowserModule,
    NgxDatatableModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
