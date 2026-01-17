import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { formatDate } from '@angular/common';
import { CostService } from '@app/shared/services/cost.service';
import { CostType } from '@app/shared/services/import-list.service';
import { LabelService } from '@app/shared/services/label.service';

@Component({
  standalone: false,templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  costTypes = CostType;
  costTypeList = [];
  costType = CostType.GENERAL_EXPENSE;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private costService: CostService,
    private alertService: AlertService,
    private labelService: LabelService,
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    for (let costType in CostType) {
      let isValueProperty = parseInt(costType, 10) >= 0;
      if (isValueProperty) {
        this.costTypeList.push({id: costType, value: this.labelService.get(CostType[costType])});
      }
    }

    this.form = this.formBuilder.group({
      costType: [''],
      date: ['', Validators.required],
      amount: [''],
      vat: [''],
      description: ['', Validators.required]
    });
    this.form.value.id = this.id;
    if (!this.isAddMode) {
      this.costService.getById(this.id)
        .pipe(first())
        .subscribe({
          next: cost => {
            this.f.date.setValue(cost.date != null ? formatDate(cost.date, 'yyyy-MM-dd', 'en') : null);
            this.f.description.setValue(cost.description);
            this.f.amount.setValue(cost.amount);
            this.f.vat.setValue(cost.vat);
            // @ts-ignore
            this.f.costType.patchValue(cost.costType.id);
            this.costType = cost.costType;
          },
          error: error => {
            this.alertService.error(error);
          }
        });
    } else {
      // @ts-ignore
      this.f.date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createCost();
    } else {
      this.updateCost();
    }
  }

  private createCost() {
    this.form.value.costType = this.costType;
    this.costService.addCost(this.form.value)
      .pipe(first())
      .subscribe({
        next: data => {
          this.alertService.success('Toevoegen gelukt', { keepAfterRouteChange: true });
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  private updateCost() {
    this.form.value.costType = this.costType;
    this.form.value.id = this.id;
    this.costService.updateCost(this.form.value)
      .pipe(first())
      .subscribe({
        next: data => {
          this.alertService.success('Wijzigen gelukt', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
