import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { CustomerService } from '@app/shared/services/customer.service';
import { ProjectService } from '@app/shared/services/project.service';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    customers = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        private customerService: CustomerService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            customers: [''],
            code: ['', Validators.required],
            projectDescription: ['', Validators.required],
            activityDescription: ['', Validators.required],
            rate: ['', Validators.required],
            paymentTermDays: ['', Validators.required]
        });
        this.customerService.getCustomers()
          .subscribe(customers => {
            this.customers = customers;
          })

        if (!this.isAddMode) {
            this.projectService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.code.setValue(x.code);
                    this.f.projectDescription.setValue(x.projectDescription);
                    this.f.activityDescription.setValue(x.activityDescription);
                    this.f.rate.setValue(x.rate);
                    this.f.paymentTermDays.setValue(x.paymentTermDays);
                    this.f.customers.patchValue(x.customer.id)
                });
        }
    }

    // convenience getter for easy access to form fields
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
        if (this.isAddMode) {
            this.createProject();
        } else {
            this.updateProject();
        }
    }

    private createProject() {
        this.projectService.addProject(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Toevoegen gelukt', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateProject() {
        this.projectService.updateProject(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Wijzigen gelukt', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
