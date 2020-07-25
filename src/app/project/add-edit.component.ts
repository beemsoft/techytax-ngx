import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { CustomerService } from '@app/shared/services/customer.service';
import { ProjectService } from '@app/shared/services/project.service';
import { formatDate } from '@angular/common';

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
            customer: [''],
            code: ['', Validators.required],
            projectDescription: ['', Validators.required],
            activityDescription: ['', Validators.required],
            rate: ['', Validators.required],
            revenuePerc: ['', Validators.pattern("\\d{1,3}(\\.\\d{0,2})?")],
            paymentTermDays: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['']
        });
        this.form.value.id = this.id;
        this.customerService.getCustomers()
          .subscribe(customers => {
            this.customers = customers;
          })

        if (!this.isAddMode) {
            this.projectService.getById(this.id)
              .pipe(first())
              .subscribe(project => {
                  this.f.code.setValue(project.code);
                  this.f.projectDescription.setValue(project.projectDescription);
                  this.f.activityDescription.setValue(project.activityDescription);
                  this.f.rate.setValue(project.rate);
                  this.f.revenuePerc.setValue(project.revenuePerc);
                  this.f.paymentTermDays.setValue(project.paymentTermDays);
                  this.f.customer.patchValue(project.customer.id);
                  this.f.startDate.setValue(project.startDate != null ? formatDate(project.startDate, 'yyyy-MM-dd', 'en') : null);
                  this.f.endDate.setValue(project.endDate != null ? formatDate(project.endDate, 'yyyy-MM-dd', 'en') : null);
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
      this.customerService.getCustomer(this.form.value.customer)
        .subscribe(customer => {
          this.form.value.customer = customer;
          this.projectService.addProject(this.form.value)
            .pipe(first())
            .subscribe(
              data => {
                this.alertService.success('Toevoegen gelukt', {keepAfterRouteChange: true});
                this.router.navigate(['.', {relativeTo: this.route}]);
              },
              error => {
                this.alertService.error(error);
                this.loading = false;
              });
        });
    }

    private updateProject() {
      this.customerService.getCustomer(this.form.value.customer)
        .subscribe(customer => {
          this.form.value.customer = customer;
          this.form.value.id = this.id;
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
        })
    }
}
