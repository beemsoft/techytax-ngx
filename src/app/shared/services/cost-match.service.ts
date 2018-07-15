import { throwError as observableThrowError } from 'rxjs';
import { VatType, CostCharacter, CostType, Transaction } from './import-list.service';
import { HttpClient } from '@angular/common/http';
// import { contentHeaders } from '../../common/headers';
// import Collection = _.Collection;
import { LabelService } from './label.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Config } from '../config/env.config';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from "@angular/common/http";

export class CostMatch {
  matchString: string;
  costType: CostType = CostType.GENERAL_EXPENSE;
  costTypeDescription: string;
  costCharacter: CostCharacter;
  vatType: VatType;
  percentage: number;
  fixedAmount: number;
}

@Injectable()
export class CostMatchService {
  private baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient, private labelService: LabelService) {
  }

  // addMatch(costMatch: CostMatch) {
  //   let body = JSON.stringify(costMatch);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   this.http.post(this.baseURL + '/auth/match', body, {headers: contentHeaders})
  //     .subscribe(
  //       response => {
  //         // localStorage.setItem('jwt', response.json().id_token);
  //         // this.router.parent.navigateByUrl('/vat');
  //       },
  //       error => {
  //         alert(error.text());
  //         console.log(error.text());
  //       }
  //     );
  // }

  getMatches(): Observable<CostMatch> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': localStorage.getItem('jwt')
      })
    };

    return this.http.get<CostMatch>(this.baseURL + '/auth/match', httpOptions)
      .pipe(
        catchError(this.handleError));
  }

  // deleteMatch(costMatch: CostMatch) {
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //
  //   this.http.delete(this.baseURL + '/auth/match/' + costMatch.id, {headers: contentHeaders})
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
  // updateMatch(costMatch: CostMatch) {
  //   let body = JSON.stringify(costMatch);
  //   contentHeaders.set('Authorization', localStorage.getItem('jwt'));
  //   let url = this.baseURL + '/auth/match';
  //   this.http.put(url, body, {headers: contentHeaders})
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
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }

  match(transactions: Array<Transaction>, costMatches: Array<CostMatch>) {
    transactions.forEach(transaction => {
      if (costMatches) {
        for (let costMatch of costMatches) {
          if (transaction.description.toLowerCase().indexOf(costMatch.matchString.toLowerCase()) > -1) {
            transaction.costType = costMatch.costType;
            transaction.costTypeDescription = this.labelService.get(CostType[costMatch.costType]);
            transaction.costCharacter = costMatch.costCharacter;
            transaction.costCharacterDescription = this.labelService.get(CostCharacter[costMatch.costCharacter]);
            transaction.costMatch = costMatch;
          }
        }
      }
    });
    return transactions;
  }
}
