import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  {
    path: 'vat',
    loadChildren: 'app/vat/vat.module#VatModule'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'fiscal-overview',
    loadChildren: 'app/fiscal-overview/fiscal-overview.module#FiscalOverviewModule'
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

