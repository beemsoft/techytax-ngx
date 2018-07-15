import {throwError as observableThrowError} from 'rxjs';
import {HttpClient} from "@angular/common/http";
// import {contentHeaders} from "../../common/headers";
import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {VatReport} from "./vat-calculation.service";
import {Config} from "../config/env.config";
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class FiscalOverviewService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // getFiscalOverview(): Observable<any> {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   return this.http.get(this.baseURL+'/auth/fiscal-overview', { headers: contentHeaders })
  //       .catch(this.handleError);
  // }

  sendFiscalData(vatReport: VatReport) {
    let body = JSON.stringify(vatReport);
    console.log(vatReport.latestTransactionDate);
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Content-Type':  'application/json',
        'Authorization': localStorage.getItem('jwt')
      })
    };

    this.http.post(this.baseURL+'/auth/fiscal-overview', body, httpOptions)
      .pipe(
        catchError(this.handleError)).subscribe(
      response => {
        // localStorage.setItem('jwt', response["token"]);
        // this.loggedIn = true;
        // this.userChanged2.emit(username);
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
    return observableThrowError(errMsg);
  }
}
