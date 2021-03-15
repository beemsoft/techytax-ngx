import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiscalOverviewComponent } from '@app/fiscal-overview/fiscal-overview.component';

const routes: Routes = [
    {
        path: '', component: FiscalOverviewComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FiscalOverviewRoutingModule { }
