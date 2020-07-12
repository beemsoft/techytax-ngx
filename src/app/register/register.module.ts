import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { RegisterService } from '../shared/services/register.service';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule
  ],
  declarations: [
    RegisterComponent
  ],
  exports: [RegisterComponent],
  providers: [
    RegisterService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RegisterModule {
}
