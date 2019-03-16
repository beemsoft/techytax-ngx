import {throwError as observableThrowError} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {VatReport} from "./vat-calculation.service";
import {catchError} from 'rxjs/operators';

@Injectable()
export class FiscalOverviewService {
  private baseURL: string = 'http://localhost:8080';
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
    console.log(vatReport.latestTransactionDate);

    this.http.post(this.baseURL+'/auth/fiscal-overview', body, this.httpOptions)
      .pipe(
        catchError(this.handleError));
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
    return observableThrowError(errMsg);
  }
}
