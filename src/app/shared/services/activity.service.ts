import {Observable, throwError} from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Project } from '@app/shared/services/project.service';

export class Activity {
  id: number;
  project: Project = new Project();
  activityDate: Date;
  hours: number;
  revenue: number;
  activityDescription: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addActivity(activity: Activity) {
    return this.http.post(this.baseURL + '/auth/activity', activity)
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.baseURL + '/auth/activity')
      .pipe(catchError(this.handleError));
  }

  getActivitiesForPreviousMonth(projectId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.baseURL + '/auth/activity/project/' + projectId)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(this.baseURL + '/auth/activity/' +  id)
      .pipe(catchError(this.handleError));
  }

  deleteById(id: number) {
    return this.http.delete(this.baseURL + '/auth/activity/' + id)
      .pipe(catchError(this.handleError));
  }

  updateActivity(activity: Activity) {
    const url = this.baseURL + '/auth/activity';
    return this.http.put(url, activity)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      (typeof error === 'string') ? error :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return throwError(errMsg);
  }
}
