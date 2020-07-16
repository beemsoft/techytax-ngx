import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

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

@Injectable()
export class BookService {
  private baseURL = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem('jwt')
    })
  };

  constructor(private http: HttpClient) {}

  addBookValue(bookValue: BookValue) {
    let body = JSON.stringify(bookValue);
    this.http.post(this.baseURL+'/auth/book', body, this.httpOptions)
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

  updateBookValue(bookValue: BookValue) {
    let body = JSON.stringify(bookValue);
    let url = this.baseURL+'/auth/book';
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

  deleteBookValue(bookValue: BookValue) {
    this.http.delete(this.baseURL+'/auth/book/'+bookValue.id, this.httpOptions)
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

  getBookValues(): Observable<BookValue[]> {
    return this.http.get<BookValue[]>(this.baseURL+'/auth/book', this.httpOptions)
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
