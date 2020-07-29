import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { ProjectService } from '@app/shared/services/project.service';
import { ActivityService } from '@app/shared/services/activity.service';
import { formatDate } from '@angular/common';

@Component({templateUrl: 'add-edit.component.html'})
export class AddEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  projects = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private activityService: ActivityService,
    private projectService: ProjectService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      project: [''],
      activityDate: ['', Validators.required],
      hours: [''],
      revenue: [''],
      activityDescription: ['', Validators.required]
    });
    this.form.value.id = this.id;
    this.projectService.getCurrentProjects()
      .subscribe(projects => {
        this.projects = projects;
      })
    if (!this.isAddMode) {
      this.activityService.getById(this.id)
        .pipe(first())
        .subscribe(activity => {
          this.f.activityDate.setValue(activity.activityDate != null ? formatDate(activity.activityDate, 'yyyy-MM-dd', 'en') : null);
          this.f.activityDescription.setValue(activity.activityDescription);
          this.f.hours.setValue(activity.hours);
          this.f.revenue.setValue(activity.revenue);
          this.f.project.patchValue(activity.project.id)
        });
    } else {
      this.f.activityDate.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
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
      this.createActivity();
    } else {
      this.updateActivity();
    }
  }

  private createActivity() {
    this.projectService.getById(this.form.value.project)
      .subscribe(project => {
        this.form.value.project = project;
        this.activityService.addActivity(this.form.value)
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

  private updateActivity() {
    this.projectService.getById(this.form.value.project)
      .subscribe(project => {
        this.form.value.project = project;
        this.form.value.id = this.id;
        this.activityService.updateActivity(this.form.value)
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
      });
  }
}
