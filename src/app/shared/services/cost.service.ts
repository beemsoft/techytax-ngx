import {throwError as observableThrowError} from 'rxjs';
import {CostType} from './import-list.service';
import {HttpClient} from '@angular/common/http';
// import {contentHeaders} from '../../common/headers';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

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

@Injectable()
export class CostService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // addCost(cost: Cost):Observable<number> {
  //   let body = JSON.stringify(cost);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   return this.http.post(this.baseURL+'/auth/cost', body, { headers: contentHeaders })
  //     .catch(this.handleError);
  // }
  //
  // deleteCost(cost: Cost):Observable<void> {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   return this.http.delete(this.baseURL+'/auth/cost/'+cost.id, { headers: contentHeaders })
  //     .catch(this.handleError);
  // }
  //
  // updateCost(cost: Cost) {
  //   let body = JSON.stringify(cost);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL+'/auth/cost';
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
  // getCost(cost: Cost): Observable<Cost> {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   return this.http.get(this.baseURL+'/auth/costs/'+cost.id, { headers: contentHeaders })
  //     .map(res => <Cost> res.json())
  //     .catch(this.handleError);
  // }
  //
  // getCosts(): Observable<Cost> {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   return this.http.get(this.baseURL+'/auth/costs', { headers: contentHeaders })
  //     .map(res => <Cost> res.json())
  //     .catch(this.handleError);
  // }

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
