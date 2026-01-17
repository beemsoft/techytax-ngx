import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutComponent } from '@app/book/layout.component';
import { ListComponent } from '@app/book/list.component';
import { AddEditComponent } from '@app/book/add-edit.component';
import { BookRoutingModule } from '@app/book/book-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    LayoutComponent,
    ListComponent,
    AddEditComponent
  ]
})
export class BookModule { }
