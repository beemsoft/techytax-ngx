import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvoiceService} from "../shared/services/invoice.service";
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {SendInvoiceComponent} from './send-invoice.component';
import {ProjectService} from '../shared/services/project.service';
import {RegisterService} from '../shared/services/register.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule
  ],
  declarations: [
    SendInvoiceComponent
  ],
  exports: [SendInvoiceComponent],
  providers: [
    InvoiceService,
    ProjectService,
    RegisterService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SendInvoiceModule {
}
