import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivityService } from '@app/shared/services/activity.service';

@Component({templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  activities = null;

  constructor(private activityService: ActivityService) {
  }

  ngOnInit() {
    this.activityService.getAll()
      .pipe(first())
      .subscribe(activities => this.activities = activities);
  }

  deleteActivity(id: number) {
    const activity = this.activities.find(x => x.id === id);
    activity.isDeleting = true;
    this.activityService.deleteById(id)
      .pipe(first())
      .subscribe(() => {
        this.activities = this.activities.filter(x => x.id !== id)
      });
  }
}
