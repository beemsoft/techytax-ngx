import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home';
import { InfoComponent } from './home/info.component';
import { AuthGuard } from './_helpers';
import { SendInvoiceComponent } from '@app/send-invoice/send-invoice.component';
import { RegisterComponent } from '@app/register/register.component';
import { VatComponent } from '@app/vat/vat.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const customerModule = () => import('./customer/customer.module').then(x => x.CustomerModule);
const projectModule = () => import('./project/project.module').then(x => x.ProjectModule);
const activityModule = () => import('./activity/activity.module').then(x => x.ActivityModule);
const bookModule = () => import('./book/book.module').then(x => x.BookModule);
const activaModule = () => import('./activa/activa.module').then(x => x.ActivaModule);
const costModule = () => import('./cost/cost.module').then(x => x.CostModule);
const vatMatchModule = () => import('./vat-match/vat-match.module').then(x => x.VatMatchModule);
const fiscalOverviewModule = () => import('./fiscal-overview/fiscal-overview.module').then(x => x.FiscalOverviewModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
  { path: 'shell', loadChildren: () => import('./shell/shell.module').then(x => x.ShellModule), canActivate: [AuthGuard] },
  { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: 'vat', component: VatComponent, canActivate: [AuthGuard] },
  { path: 'vat-match', loadChildren: vatMatchModule },
  { path: 'invoice', component: SendInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'customer', loadChildren: customerModule },
  { path: 'project', loadChildren: projectModule },
  { path: 'activity', loadChildren: activityModule },
  { path: 'account', loadChildren: accountModule },
  { path: 'book', loadChildren: bookModule },
  { path: 'activa', loadChildren: activaModule },
  { path: 'cost', loadChildren: costModule },
  { path: 'fiscal-overview', loadChildren: fiscalOverviewModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
