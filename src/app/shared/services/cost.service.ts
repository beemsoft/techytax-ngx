import { throwError as observableThrowError } from 'rxjs';
import { CostType } from './import-list.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { catchError } from 'rxjs/operators';

export class Cost {
  id: number;
  description: string;
  costType: CostType;
  costTypeId: number;
  costTypeDescription: string;
  date: string;
  amount: number;
  vat: number;
}

@Injectable({ providedIn: 'root' })
export class CostService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  deleteCost(id: string) {
    return this.http.delete(this.baseURL+'/auth/cost/'+id)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Cost> {
    return this.http.get<Cost>(this.baseURL+'/auth/costs/'+  id)
      .pipe(catchError(this.handleError));
  }

  getCosts(): Observable<Cost> {
    return this.http.get<Cost>(this.baseURL+'/auth/costs')
      .pipe(catchError(this.handleError));
  }

  addCost(cost: Cost) {
    let body = JSON.stringify(cost);
    return this.http.post(this.baseURL+'/auth/costs', body )
      .pipe(catchError(this.handleError));
  }

  updateCost(cost: Cost) {
    let body = JSON.stringify(cost);
    let url = this.baseURL+'/auth/costs';
    return this.http.put(url, body)
      .pipe(catchError(this.handleError));
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}
