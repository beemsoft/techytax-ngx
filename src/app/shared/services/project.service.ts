import { VatType } from "./import-list.service";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { Customer } from "./customer.service";
import { environment } from '../../../environments/environment';
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
    let body = JSON.stringify(project);
    return this.http.post(this.baseURL+'/auth/project', body )
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseURL+'/auth/project')
      .pipe(catchError(this.handleError));
  }

  getCurrentProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseURL+'/auth/project/current')
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Project> {
    return this.http.get<Project>(this.baseURL+'/auth/project/'+  id)
      .pipe(catchError(this.handleError));
  }

  deleteById(id: string) {
    return this.http.delete(this.baseURL+'/auth/project/'+id)
      .pipe(catchError(this.handleError));
  }

  updateProject(project: Project) {
    let body = JSON.stringify(project);
    let url = this.baseURL+'/auth/project';
    return this.http.put(url, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP error
   */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
