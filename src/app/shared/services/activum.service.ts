import { Observable, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export enum ActivumType {
  MACHINERY = 1,
  CAR = 2,
  OFFICE = 7
}

export class Activum {
  description: string;
  balanceType: ActivumType = ActivumType.MACHINERY;
  balanceTypeDescription: string;
  purchasePrice: number;
  remainingValue: number;
  nofYearsForDepreciation: number;
  purchaseDate: string;
  startDate: string;
  endDate: string;
}

export class BusinessCar extends Activum {
  fiscalIncomeAddition: number;
  vatCorrectionForPrivateUsage: number
}

export class Office extends Activum {
  startupCosts: number;
  nofSquareMetersBusiness: number;
  nofSquareMetersPrivate: number;
  wozValue: number;
  terrainValue: number;
}

@Injectable({ providedIn: 'root' })
export class ActivumService {
  private baseURL = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': localStorage.getItem('jwt')
    })
  };

  constructor(private http: HttpClient) {}

  // addActivum(activum: Activum) {
  //   let body = JSON.stringify(activum);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/activum/machine';
  //   this.http.post(url, body, { headers: contentHeaders })
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
  //
  // addActivumCar(businessCar: BusinessCar) {
  //   let body = JSON.stringify(businessCar);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/activum/car';
  //   this.http.post(url, body, { headers: contentHeaders })
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
  // addActivumOffice(activum: Office) {
  //   let body = JSON.stringify(activum);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/activum/office';
  //   this.http.post(url, body, { headers: contentHeaders })
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
  // updateActivum(activum: Activum) {
  //   let body = JSON.stringify(activum);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/activum/machine';
  //   this.http.put(url, body, { headers: contentHeaders })
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
  // updateActivumCar(businessCar: BusinessCar) {
  //   let body = JSON.stringify(businessCar);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/activum/car';
  //   this.http.put(url, body, { headers: contentHeaders })
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
  // updateActivumOffice(activum: Office) {
  //   let body = JSON.stringify(activum);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/activum/office';
  //   this.http.put(url, body, { headers: contentHeaders })
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
  // deleteActivum(activum: Activum) {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   this.http.delete(this.baseURL+'/auth/activum/'+activum.id, { headers: contentHeaders })
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

  getActiva(): Observable<Activum> {
    return this.http.get<Activum>(this.baseURL+'/auth/activum')
      .pipe(
        catchError(this.handleError));
  }

  getActivumCar(): Observable<BusinessCar> {
    return this.http.get<BusinessCar>(this.baseURL+'/auth/activum/car')
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
