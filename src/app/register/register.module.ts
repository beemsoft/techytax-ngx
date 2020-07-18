import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterComponent } from "./register.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterRoutingModule } from '@app/register/register-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RegisterRoutingModule
    ],
    declarations: [
        RegisterComponent
    ]
})

export class RegisterModule { }
