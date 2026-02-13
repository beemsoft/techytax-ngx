import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { BookService, BookType, BookValue } from '@app/shared/services/book.service';
import { LabelService } from '@app/shared/services/label.service';

@Component({
  standalone: false,templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  bookValue: BookValue;
  balanceTypeList = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private alertService: AlertService,
    private labelService: LabelService
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      balanceType: [''],
      bookYear: [''],
      saldo: ['']
    });
    this.form.value.id = this.id;
    if (!this.isAddMode) {
      this.bookService.getById(this.id)
        .pipe(first())
        .subscribe({
          next: bookValue => {
            this.bookValue = bookValue
            const balanceType = typeof bookValue.balanceType === 'string' ? BookType[bookValue.balanceType as keyof typeof BookType] : bookValue.balanceType;
            this.f.balanceType.setValue(balanceType);
            this.f.bookYear.setValue(bookValue.bookYear);
            this.f.saldo.setValue(bookValue.saldo);
          },
          error: error => {
            this.alertService.error(error);
          }
        });
    } else {

    }

    for (let bookType in BookType) {
      let isValueProperty = parseInt(bookType, 10) >= 0;
      if (isValueProperty) {
        this.balanceTypeList.push({key: parseInt(bookType, 10), value: this.labelService.get(BookType[bookType])});
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
      this.createBookValue();
    } else {
      this.updateBookValue();
    }
  }

  private createBookValue() {
    this.bookService.addBookValue(this.form.value)
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

  private updateBookValue() {
    this.form.value.id = this.bookValue.id;
    this.bookService.updateBookValue(this.form.value)
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
