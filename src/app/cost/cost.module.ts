import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutComponent } from '@app/cost/layout.component';
import { ListComponent } from '@app/cost/list.component';
import { AddEditComponent } from '@app/cost/add-edit.component';
import { CostRoutingModule } from '@app/cost/cost-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CostRoutingModule
  ],
  declarations: [
    LayoutComponent,
    ListComponent,
    AddEditComponent
  ]
})
export class CostModule { }
