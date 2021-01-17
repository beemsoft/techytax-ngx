import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { CostMatch, CostMatchService } from '@app/shared/services/cost-match.service';
import { CostCharacter, CostType, VatType } from '@app/shared/services/import-list.service';
import { LabelService } from '@app/shared/services/label.service';

@Component({templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  costTypes = CostType;
  costTypeList = [];
  costCharacters = CostCharacter;
  costCharacterList = [];
  vatTypes = VatType;
  vatTypeList = [];
  costMatch: CostMatch;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private costMatchService: CostMatchService,
    private labelService: LabelService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      matchString: ['', Validators.required],
      costType: [''],
      costCharacter: [''],
      vatType: [''],
      percentage: [''],
      fixedAmount: ['']
    });
    this.form.value.id = this.id;
    if (!this.isAddMode) {
      this.costMatchService.getById(this.id)
        .pipe(first())
        .subscribe(costMatch => {
          this.costMatch = costMatch
          this.f.matchString.setValue(costMatch.matchString);
          this.f.costType.setValue(costMatch.costType['id']);
          this.f.costCharacter.setValue(costMatch.costCharacter);
          this.f.vatType.setValue(costMatch.vatType);
          this.f.percentage.setValue(costMatch.percentage);
          this.f.fixedAmount.setValue(costMatch.fixedAmount);
        });
    } else {

    }
    for (let costType in CostType) {
      let isValueProperty = parseInt(costType, 10) >= 0;
      if (isValueProperty) {
        this.costTypeList.push({key: costType, value: this.labelService.get(CostType[costType])});
      }
    }
    for (let costCharacter in CostCharacter) {
      let isValueProperty = parseInt(costCharacter, 10) >= 0;
      if (isValueProperty) {
        this.costCharacterList.push({key: costCharacter, value: this.labelService.get(CostCharacter[costCharacter])});
      }
    }
    for (let vatType in VatType) {
      let isValueProperty = parseInt(vatType, 10) >= 0;
      if (isValueProperty) {
        this.vatTypeList.push({key: vatType, value: this.labelService.get(VatType[vatType])});
      }
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
      this.createMatch();
    } else {
      this.updateMatch();
    }
  }

  private createMatch() {
    let costMatch = new CostMatch();
    this.costMatchService.addMatch(costMatch)
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
  }

  private updateMatch() {
    this.form.value.id = this.costMatch.id;
    this.costMatchService.updateMatch(this.form.value)
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
