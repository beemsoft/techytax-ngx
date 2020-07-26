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
        this.form = this.formBuilder.group({
            companyName: ['', [ Validators.required ]],
            address: ['', [ Validators.required ]],
            zipCode: ['', [ Validators.required ]],
            city: ['', [ Validators.required ]],
            firstName: ['', [ Validators.required, Validators.pattern("([A-Z].?)+") ]],
            prefix: ['', []],
            lastName: ['', [ Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z]+") ]],
            email: ['', [ Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$") ]],
            phoneNumber: ['', [ Validators.required, Validators.pattern("\\d{10}") ]],
            password: ['', [ Validators.minLength(6) ]],
            kvkNummer: ['', [ Validators.required, Validators.pattern("\\d{8}") ]],
            bigNummer: ['', [ Validators.pattern("\\d{11}") ]],
            ibanNummer: ['', [ Validators.required, Validators.pattern("[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}") ]],
            btwNummer: ['', []],
        });
        this.registerService.getRegistration()
          .subscribe((registration) => {
            this.registration = registration
            this.f.companyName.setValue(registration.companyData.companyName);
            this.f.address.setValue(registration.companyData.address);
            this.f.zipCode.setValue(registration.companyData.zipCode);
            this.f.city.setValue(registration.companyData.city);
            this.f.firstName.setValue(registration.personalData.initials);
            this.f.prefix.setValue(registration.personalData.prefix);
            this.f.lastName.setValue(registration.personalData.surname);
            this.f.email.setValue(registration.personalData.email);
            this.f.phoneNumber.setValue(registration.personalData.phoneNumber);
            this.f.kvkNummer.setValue(registration.companyData.chamberOfCommerceNumber);
            this.f.bigNummer.setValue(registration.companyData.jobsInIndividualHealthcareNumber);
            this.f.ibanNummer.setValue(registration.companyData.accountNumber);
            this.f.btwNummer.setValue(registration.fiscalData.vatNumber);
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.registration.personalData.phoneNumber = this.f.phoneNumber.value;
        this.registration.personalData.email = this.f.email.value;
        this.registration.personalData.surname = this.f.lastName.value;
        this.registration.personalData.prefix = this.f.prefix.value;
        this.registration.personalData.initials = this.f.firstName.value;
        this.registration.companyData.companyName = this.f.companyName.value;
        this.registration.companyData.address = this.f.address.value;
        this.registration.companyData.zipCode = this.f.zipCode.value;
        this.registration.companyData.city = this.f.city.value;
        this.registration.companyData.jobsInIndividualHealthcareNumber = this.f.bigNummer.value;
        this.registration.companyData.chamberOfCommerceNumber = this.f.kvkNummer.value;
        this.registration.fiscalData.vatNumber = this.f.btwNummer.value;
        this.registration.companyData.accountNumber = this.f.ibanNummer.value;
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
