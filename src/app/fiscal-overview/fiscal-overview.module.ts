import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabelService} from "../shared/services/label.service";
import {InvoiceService} from "../shared/services/invoice.service";
import {FiscalOverviewService} from "../shared/services/fiscal-overview.service";
import {FormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material';
import {FiscalOverviewComponent} from './fiscal-overview.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule
  ],
  declarations: [
    FiscalOverviewComponent
  ],
  exports: [FiscalOverviewComponent],
  providers: [
    LabelService,
    InvoiceService,
    FiscalOverviewService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FiscalOverviewModule {
}
