import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FiscalOverviewComponent } from "./fiscal-overview.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: FiscalOverviewComponent}
    ])
  ],
  exports: [RouterModule]
})
export class FiscalOverviewRoutingModule {
}