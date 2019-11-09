import {throwError as observableThrowError} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {VatReport} from "./vat-calculation.service";
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable()
export class FiscalOverviewService {
  private baseURL = environment.API;

  private httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem('jwt')
    })
  };

  constructor(private http: HttpClient) {}

  getFiscalOverview(): Observable<any> {
    return this.http.get(this.baseURL+'/auth/fiscal-overview', this.httpOptions)
      .pipe(
        catchError(this.handleError));
  }

  sendFiscalData(vatReport: VatReport) {
    let body = JSON.stringify(vatReport);
    this.http.post(this.baseURL+'/auth/fiscal-overview', body, this.httpOptions)
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

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}
