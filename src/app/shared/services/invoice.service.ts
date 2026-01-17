import { Observable, throwError as observableThrowError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export class Invoice {
  id: number;
  invoiceNumber: string;
  originalInvoiceNumber: string;
  month: string;
  project: any;
  unitsOfWork: number;
  revenue: number;
  htmlText: string;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // addInvoice(invoice: Invoice) {
  //   let body = JSON.stringify(invoice);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   this.http.post(this.baseURL+'/auth/invoice', body, { headers: contentHeaders })
  //       .subscribe(
  //           response => {
  //             // localStorage.setItem('jwt', response.json().id_token);
  //             // this.router.parent.navigateByUrl('/vat');
  //           },
  //           error => {
  //             alert(error.text());
  //             console.log(error.text());
  //           }
  //       );
  // }
  //
  // getInvoices(): Observable<Invoice> {
  //   return this.http.get<Invoice>(this.baseURL+'/auth/invoice', this.httpOptions)
  //     .pipe(
  //       catchError(this.handleError));
  // }

  getIncomeForLatestPeriod(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseURL+'/auth/invoice/latest-period')
      .pipe(
        catchError(this.handleError));
  }

  // deleteInvoice(invoice: Invoice) {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   this.http.delete(this.baseURL+'/auth/invoice/'+invoice.id, { headers: contentHeaders })
  //       .subscribe(
  //           response => {
  //             // localStorage.setItem('jwt', response.json().id_token);
  //             // this.router.parent.navigateByUrl('/vat');
  //           },
  //           error => {
  //             alert(error);
  //             console.log(error);
  //           }
  //       );
  // }
  //
  // updateInvoice(invoice: Invoice) {
  //   let body = JSON.stringify(invoice);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   this.http.put(this.baseURL+'/auth/invoice', body, { headers: contentHeaders })
  //       .subscribe(
  //           response => {
  //             // localStorage.setItem('jwt', response.json().id_token);
  //             // this.router.parent.navigateByUrl('/vat');
  //           },
  //           error => {
  //             alert(error);
  //             console.log(error);
  //           }
  //       );
  // }
  //
  // createInvoicePdf(invoice: Invoice): any {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/invoice/' + invoice.id;
  //   // FIXME: ResponseContentType.ArrayBuffer
  //   return this.http.get(url, {headers: contentHeaders, responseType: ''}).map(
  //     (res) => {
  //       return new Blob([res.blob()], {type: 'application/pdf'})
  //     });
  // }
  //
  // sendInvoice(invoice: Invoice, htmlText: string) {
  //   let body = htmlText;
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   this.http.post(this.baseURL+'/auth/invoice/' + invoice.id + '/send', body, { headers: contentHeaders })
  //     .subscribe(
  //       response => {
  //         // localStorage.setItem('jwt', response.json().id_token);
  //         // this.router.parent.navigateByUrl('/vat');
  //       },
  //       error => {
  //         alert(error);
  //         console.log(error);
  //       }
  //     );
  // }

  sendInvoice(invoice: Invoice) {
    this.http.post(this.baseURL + '/auth/invoice/send', invoice)
      .subscribe({
        next: response => {
          console.log('Invoice sent successfully', response);
        },
        error: error => {
          alert(error);
          console.log(error);
        }
      });
  }

  // sendReminder(invoice: Invoice, htmlText: string) {
  //   let body = htmlText;
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   this.http.post(this.baseURL+'/auth/invoice/' + invoice.id + '/remind', body, { headers: contentHeaders })
  //     .subscribe(
  //       response => {
  //         // localStorage.setItem('jwt', response.json().id_token);
  //         // this.router.parent.navigateByUrl('/vat');
  //       },
  //       error => {
  //         alert(error);
  //         console.log(error);
  //       }
  //     );
  // }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      (typeof error === 'string') ? error :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}
