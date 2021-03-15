import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiscalOverviewComponent } from './fiscal-overview.component';
import { FiscalOverviewRoutingModule } from '@app/fiscal-overview/fiscal-overview-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FiscalOverviewRoutingModule
  ],
  declarations: [
    FiscalOverviewComponent
  ]
})
export class FiscalOverviewModule {
}
