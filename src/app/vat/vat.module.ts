import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatComponent } from './vat.component';
import { TransactionTableComponent } from './transaction-table.component';
import { VatReportComponent } from './vat-report.component';
import { CostMatchService } from '../shared/services/cost-match.service';
import { VatCalculationService } from '../shared/services/vat-calculation.service';
import { VatRoutingModule } from "./vat-routing.module";
import { ImportListService } from "../shared/services/import-list.service";
import { CsvParseService } from "../shared/services/csv-parse.service";
import { LabelService } from "../shared/services/label.service";
import { ActivumService } from "../shared/services/activum.service";
import { InvoiceService } from "../shared/services/invoice.service";
import { FiscalOverviewService } from "../shared/services/fiscal-overview.service";
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    FormsModule,
    VatRoutingModule,
    CommonModule,
    MatTableModule
  ],
  declarations: [
    VatComponent,
    TransactionTableComponent,
    VatReportComponent
  ],
  exports: [VatComponent],
  providers: [
    ImportListService,
    CsvParseService,
    LabelService,
    ActivumService,
    InvoiceService,
    FiscalOverviewService,
    CostMatchService,
    VatCalculationService,
    TransactionTableComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class VatModule {
}
