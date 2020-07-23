import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Home2Component } from '@app/home2';
import { VatComponent } from '@app/vat';
import { SendInvoiceComponent } from '@app/send-invoice/send-invoice.component';
import { RegisterComponent } from '@app/register/register.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const customerModule = () => import('./customer/customer.module').then(x => x.CustomerModule);
const projectModule = () => import('./project/project.module').then(x => x.ProjectModule);
const activityModule = () => import('./activity/activity.module').then(x => x.ActivityModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home2', component: Home2Component, canActivate: [AuthGuard] },
  { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: 'vat', component: VatComponent, canActivate: [AuthGuard] },
  { path: 'invoice', component: SendInvoiceComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'customer', loadChildren: customerModule },
  { path: 'project', loadChildren: projectModule },
  { path: 'activity', loadChildren: activityModule },
  { path: 'account', loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
