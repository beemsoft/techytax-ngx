import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutComponent } from '@app/book/layout.component';
import { ListComponent } from '@app/book/list.component';
import { AddEditComponent } from '@app/book/add-edit.component';
import { BookRoutingModule } from '@app/book/book-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookRoutingModule
  ],
  declarations: [
    LayoutComponent,
    ListComponent,
    AddEditComponent
  ]
})
export class BookModule { }
