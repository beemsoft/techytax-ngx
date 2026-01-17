import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VatModule } from "./vat/vat.module";
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from "./app-routing.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from "./login/login.component";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { FiscalOverviewModule } from './fiscal-overview/fiscal-overview.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { SendInvoiceModule } from './send-invoice/send-invoice.module';
import { ErrorInterceptor, JwtInterceptor } from '@app/_helpers';
import { AlertComponent } from '@app/_components';
import { HomeComponent } from '@app/home';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { RegisterModule } from '@app/register/register.module';
import { CustomerModule } from '@app/customer/customer.module';
import { ActivaModule } from '@app/activa/activa.module';
import { CostModule } from '@app/cost/cost.module';
import { BookModule } from '@app/book/book.module';

import { provideZoneChangeDetection } from '@angular/core';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    VatModule,
    FiscalOverviewModule,
    SendInvoiceModule,
    RegisterModule,
    CustomerModule,
    BookModule,
    ActivaModule,
    CostModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent
  ],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
