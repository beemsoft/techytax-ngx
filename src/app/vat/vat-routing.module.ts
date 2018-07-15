import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VatComponent } from "./vat.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: VatComponent}
    ])
  ],
  exports: [RouterModule]
})
export class VatRoutingModule {
}