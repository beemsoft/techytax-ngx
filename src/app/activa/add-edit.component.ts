import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Activum, ActivumService, ActivumType } from '@app/shared/services/activum.service';
import { LabelService } from '@app/shared/services/label.service';

@Component({templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  activum: Activum;
  activumTypes = ActivumType;
  activumTypeList = [];
  balanceType = ActivumType.MACHINERY;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private activumService: ActivumService,
    private alertService: AlertService,
    private labelService: LabelService,
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    for (let activumType in ActivumType) {
      let isValueProperty = parseInt(activumType, 10) >= 0;
      if (isValueProperty) {
        this.activumTypeList.push({id: ActivumType[activumType], value: this.labelService.get(ActivumType[activumType])});
      }
    }

    this.form = this.formBuilder.group({
      balanceType: [''],
      description: ['', Validators.required],
      purchasePrice: [''],
      remainingValue: [''],
      nofYearsForDepreciation: [''],
      purchaseDate: [''],
      startDate: [''],
      endDate: ['']
    });
    this.form.value.id = this.id;
    if (!this.isAddMode) {
      this.activumService.getById(this.id)
        .pipe(first())
        .subscribe(activum => {
          this.activum = activum
          if (activum.balanceType) {
            // @ts-ignore
            this.f.balanceType.patchValue(activum.balanceType);
            this.balanceType = activum.balanceType;
          }
          this.f.description.setValue(activum.description);
          this.f.purchasePrice.setValue(activum.purchasePrice);
          this.f.remainingValue.setValue(activum.remainingValue);
          this.f.nofYearsForDepreciation.setValue(activum.nofYearsForDepreciation);
          this.f.purchaseDate.setValue(activum.purchaseDate);
          this.f.startDate.setValue(activum.startDate);
          this.f.endDate.setValue(activum.endDate);
        });
    } else {

    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

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
      // this.createMatch();
    } else {
      this.updateActivum();
    }
  }

  // private createMatch() {
  //   let costMatch = new CostMatch();
  //   this.costMatchService.addMatch(costMatch)
  //     .pipe(first())
  //     .subscribe(
  //       data => {
  //         this.alertService.success('Toevoegen gelukt', {keepAfterRouteChange: true});
  //         this.router.navigate(['.', {relativeTo: this.route}]);
  //       },
  //       error => {
  //         this.alertService.error(error);
  //         this.loading = false;
  //       });
  // }

  private updateActivum() {
    this.form.value.id = this.activum.id;
    this.activumService.updateActivum(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Wijzigen gelukt', {keepAfterRouteChange: true});
          this.router.navigate(['..', {relativeTo: this.route}]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
