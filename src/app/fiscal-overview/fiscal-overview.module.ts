import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalOverviewComponent } from './fiscal-overview.component';
import { FiscalOverviewRoutingModule } from '@app/fiscal-overview/fiscal-overview-routing.module';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FiscalOverviewRoutingModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    FiscalOverviewComponent
  ]
})
export class FiscalOverviewModule {
}
