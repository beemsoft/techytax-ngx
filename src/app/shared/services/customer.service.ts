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

@Injectable()
export class CustomerService {
  private baseURL = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem('jwt')
    })
  };

  constructor(private http: HttpClient) {}

  addCustomer(customer: Customer) {
    let body = JSON.stringify(customer);

    this.http.post(this.baseURL+'/auth/customer', body, this.httpOptions)
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

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseURL+'/auth/customer', this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(this.baseURL+'/auth/customer/'+  id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(customer: Customer) {

    this.http.delete(this.baseURL+'/auth/customer/'+customer.id, this.httpOptions)
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

  updateCustomer(customer: Customer) {
    let body = JSON.stringify(customer);
    let url = this.baseURL+'/auth/customer';
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
