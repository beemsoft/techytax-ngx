import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatComponent } from './vat.component';
import { TransactionTableComponent } from './transaction-table.component';
import { VatReportComponent } from './vat-report.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CostTypeSelector, KeysPipe } from '../shared/selectors/cost-type.selector';
import { LabelPipe } from '../pipes/label.pipe';
import { VatTypeSelector } from '../shared/selectors/vat-type.selector';
import { CostCharacterSelector } from '../shared/selectors/cost-character.selector';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule
  ],
  declarations: [
    VatComponent,
    TransactionTableComponent,
    VatReportComponent,
    KeysPipe,
    CostTypeSelector,
    VatTypeSelector,
    CostCharacterSelector,
    LabelPipe
  ],
  providers: [
    TransactionTableComponent
  ]
})

export class VatModule {
}
