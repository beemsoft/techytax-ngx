import { Observable, throwError as observableThrowError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export enum ActivumType {
  MACHINERY = 1,
  CAR = 2,
  OFFICE = 7
}

export class Activum {
  id: number;
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

  constructor(private http: HttpClient) {}

  deleteActivum(id: string) {
    return this.http.delete(this.baseURL+'/auth/activum/'+id)
      .pipe(catchError(this.handleError));
  }

  getActiva(): Observable<Activum> {
    return this.http.get<Activum>(this.baseURL+'/auth/activum')
      .pipe(
        catchError(this.handleError));
  }

  getById(id: number): Observable<Activum> {
    return this.http.get<Activum>(this.baseURL+'/auth/activum/'+  id)
      .pipe(catchError(this.handleError));
  }

  updateActivum(activum: Activum) {
    let body = JSON.stringify(activum);
    let url = this.baseURL+'/auth/activum';
    return this.http.put(url, body)
      .pipe(catchError(this.handleError));
  }

  getActivumCar(): Observable<number> {
    return this.http.get<number>(this.baseURL+'/auth/activum/car/vat-correction-for-private-usage')
      .pipe(
        catchError(this.handleError));
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
