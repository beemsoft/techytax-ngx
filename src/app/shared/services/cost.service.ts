import { throwError as observableThrowError } from 'rxjs';
import { CostType } from './import-list.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
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
  billImage?: string;
  itemImage?: string;
}

@Injectable({ providedIn: 'root' })
export class CostService {
  public baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  deleteCost(id: string) {
    return this.http.delete(this.baseURL + '/auth/cost/' + id)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<Cost> {
    return this.http.get<Cost>(this.baseURL + '/auth/costs/' +  id)
      .pipe(catchError(this.handleError));
  }

  getCosts(): Observable<Cost> {
    return this.http.get<Cost>(this.baseURL + '/auth/costs')
      .pipe(catchError(this.handleError));
  }

  addCost(cost: any, billImage?: File, itemImage?: File) {
    const formData = this.createFormData(cost, billImage, itemImage);
    return this.http.post(this.baseURL + '/auth/cost', formData)
      .pipe(catchError(this.handleError));
  }

  updateCost(cost: any, billImage?: File, itemImage?: File) {
    const url = this.baseURL + '/auth/cost';
    const formData = this.createFormData(cost, billImage, itemImage);
    return this.http.put(url, formData)
      .pipe(catchError(this.handleError));
  }

  private createFormData(cost: any, billImage?: File, itemImage?: File): FormData {
    const formData = new FormData();
    formData.append('cost', JSON.stringify(cost));
    if (billImage) {
      formData.append('billImage', billImage);
    }
    if (itemImage) {
      formData.append('itemImage', itemImage);
    }
    return formData;
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      (typeof error === 'string') ? error :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}
