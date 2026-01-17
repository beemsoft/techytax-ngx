import { VatType } from './import-list.service';
import {Observable, throwError} from 'rxjs';
import { Injectable } from '@angular/core';
import { Customer } from './customer.service';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export class Project {
  id: number;
  customer: Customer = new Customer();
  code: string;
  projectDescription: string;
  activityDescription: string;
  startDate: Date;
  endDate: Date;
  rate: number;
  revenuePerc: number;
  paymentTermDays: number;
  vatType: VatType;
}

@Injectable()
export class ProjectService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addProject(project: Project) {
    const body = JSON.stringify(project);
    return this.http.post(this.baseURL + '/auth/project', body )
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseURL + '/auth/project')
      .pipe(catchError(this.handleError));
  }

  getCurrentProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseURL + '/auth/project/current')
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Project> {
    return this.http.get<Project>(this.baseURL + '/auth/project/' +  id)
      .pipe(catchError(this.handleError));
  }

  deleteById(id: string) {
    return this.http.delete(this.baseURL + '/auth/project/' + id)
      .pipe(catchError(this.handleError));
  }

  updateProject(project: Project) {
    const body = JSON.stringify(project);
    const url = this.baseURL + '/auth/project';
    return this.http.put(url, body)
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
