import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivityService } from '@app/shared/services/activity.service';

@Component({
  standalone: false,templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  activities = signal<any[] | null>(null);

  constructor(
    private activityService: ActivityService
  ) {
  }

  ngOnInit() {
    this.activityService.getAll()
      .pipe(first())
      .subscribe(activities => {
        this.activities.set(activities);
      });
  }

  deleteActivity(id: number) {
    const activity = this.activities().find(x => x.id === id);
    activity.isDeleting = true;
    this.activityService.deleteById(id)
      .pipe(first())
      .subscribe(() => {
        this.activities.set(this.activities().filter(x => x.id !== id));
      });
  }
}
