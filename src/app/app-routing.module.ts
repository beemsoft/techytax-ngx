import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VatComponent} from './vat/vat.component';
import {LoginComponent} from './login/login.component';
import {FiscalOverviewComponent} from './fiscal-overview/fiscal-overview.component';

const routes: Routes = [
  {
    path: 'vat',
    component: VatComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'fiscal-overview',
    component: FiscalOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
