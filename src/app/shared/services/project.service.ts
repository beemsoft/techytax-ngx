import {VatType} from "./import-list.service";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Customer} from "./customer.service";
import * as moment from "moment/moment";
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

export class Project {
  id: number;
  customer: Customer = new Customer();
  code: string;
  projectDescription: string;
  activityDescription: string;
  startDate: moment.Moment;
  endDate: moment.Moment;
  rate: number;
  paymentTermDays: number;
  vatType: VatType;
}

@Injectable()
export class ProjectService {
  private baseURL = environment.API;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem('jwt')
    })
  };

  constructor(private http: HttpClient) {}

  addProject(project: Project) {
    let body = JSON.stringify(project);

    this.http.post(this.baseURL+'/auth/project', body, this.httpOptions)
      .subscribe(
        response => {
          // localStorage.setItem('jwt', response.json().id_token);
          // this.router.parent.navigateByUrl('/vat');
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseURL+'/auth/project', this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(this.baseURL+'/auth/project/'+  id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteProject(project: Project) {
    this.http.delete(this.baseURL+'/auth/project/'+project.id, this.httpOptions)
      .subscribe(
        response => {
          // localStorage.setItem('jwt', response.json().id_token);
          // this.router.parent.navigateByUrl('/vat');
        },
        error => {
          alert(error);
          console.log(error);
        }
      );
  }

  updateProject(project: Project) {
    let body = JSON.stringify(project);
    let url = this.baseURL+'/auth/project';
    this.http.put(url, body, this.httpOptions)
      .subscribe(
        response => {
          // localStorage.setItem('jwt', response.json().id_token);
          // this.router.parent.navigateByUrl('/vat');
        },
        error => {
          alert(error);
          console.log(error);
        }
      );
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
