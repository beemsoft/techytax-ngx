import { throwError as observableThrowError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { VatReport } from "./vat-calculation.service";
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FiscalOverviewService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFiscalOverview(): Observable<any> {
    return this.http.get(this.baseURL+'/auth/fiscal-overview')
      .pipe(
        catchError(this.handleError));
  }

  sendFiscalData(vatReport: VatReport) {
    let body = JSON.stringify(vatReport);
    return this.http.post(this.baseURL+'/auth/fiscal-overview', body)
      .pipe(
        catchError(this.handleError));
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}
