import { Component, OnInit } from "@angular/core";
import { RegisterService, Registration } from "../shared/services/register.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    public registration: Registration;
    public acceptedTermsAndConditions: boolean = false;
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private registerService: RegisterService,
      private alertService: AlertService,
      private router: Router
    ) {}

    ngOnInit(): void {
        this.registerService.getRegistration().subscribe((registration) => {
            this.registration = registration
            const passwordValidators = [Validators.minLength(6)];
            passwordValidators.push(Validators.required);
            this.form = this.formBuilder.group({
                firstName: ['', [ Validators.required, Validators.pattern("([A-Z].?)+") ]],
                prefix: ['', []],
                lastName: ['', [ Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z]+") ]],
                email: ['', [ Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$") ]],
                phoneNumber: ['', [ Validators.required, Validators.pattern("\\d{10}") ]],
                password: ['', [ Validators.required, Validators.minLength(6) ]],
                kvkNummer: ['', [ Validators.required, Validators.pattern("\\d{8}") ]]
            });
            this.f.firstName.setValue(registration.personalData.initials);
            this.f.lastName.setValue(registration.personalData.surname);
            this.f.email.setValue(registration.personalData.email);
            this.f.phoneNumber.setValue(registration.personalData.phoneNumber);
            this.f.kvkNummer.setValue(registration.companyData.chamberOfCommerceNumber);
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        console.log('Submit!');
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.registration.personalData.phoneNumber = this.f.phoneNumber.value;
        this.registerService.updateRegistration(this.registration)
          .pipe(first())
          .subscribe(
            data => {
                this.alertService.success('Gegevens gewijzigd', { keepAfterRouteChange: true });
                this.loading = false;
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    public editRegistration() {
        this.router.navigateByUrl('/register-edit');
    }

    public showTermsAndConditions():void {
        // this.childModal.open();
    }

    public hideChildModal():void {
        this.acceptedTermsAndConditions = false;
        // this.childModal.close();
    }

    public accept():void {
        // this.childModal.close();
        this.acceptedTermsAndConditions = true;
    }
}
