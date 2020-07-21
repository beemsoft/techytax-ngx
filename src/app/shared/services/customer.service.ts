import {Observable} from "rxjs/Rx";
import {Injectable} from "@angular/core";
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

export class Customer {
  id: number;
  name: string;
  address: string;
  emailInvoice: string;
  contact: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addCustomer(customer: Customer) {
    let body = JSON.stringify(customer);
    return this.http.post(this.baseURL+'/auth/customer', body)
      .pipe(catchError(this.handleError));
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseURL+'/auth/customer')
      .pipe(catchError(this.handleError));
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(this.baseURL+'/auth/customer/'+  id)
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(id: string) {
    return this.http.delete(this.baseURL+'/auth/customer/'+id)
      .pipe(catchError(this.handleError));
  }

  updateCustomer(customer: Customer) {
    let body = JSON.stringify(customer);
    let url = this.baseURL+'/auth/customer';
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
