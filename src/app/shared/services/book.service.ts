import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export enum BookType {
  MACHINERY = 1,
  CAR = 2,
  CURRENT_ASSETS = 3,
  NON_CURRENT_ASSETS = 4,
  PENSION = 5,
  STOCK = 6,
  OFFICE = 7,
  VAT_TO_BE_PAID = 8,
  INVOICES_TO_BE_PAID = 9
}

export class BookValue {
  id: number;
  balanceType: BookType;
  balanceTypeDescription: string;
  bookYear: number;
  saldo: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<BookValue> {
    return this.http.get<BookValue>(this.baseURL+'/auth/book/'+  id)
      .pipe(catchError(this.handleError));
  }

  addBookValue(bookValue: BookValue) {
    let body = JSON.stringify(bookValue);
    return this.http.post(this.baseURL + '/auth/book', body)
  }

  updateBookValue(bookValue: BookValue) {
    let body = JSON.stringify(bookValue);
    let url = this.baseURL+'/auth/book';
    return this.http.put(url, body)
      .pipe(catchError(this.handleError));
  }

  deleteBookValue(id: string) {
    return this.http.delete(this.baseURL+'/auth/book/'+id)
      .pipe(catchError(this.handleError));
  }

  getBookValues(): Observable<BookValue[]> {
    return this.http.get<BookValue[]>(this.baseURL+'/auth/book')
      .pipe(catchError(this.handleError));
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
