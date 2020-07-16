import {Observable, throwError as observableThrowError} from 'rxjs';
import {CostCharacter, CostType, Transaction, VatType} from './import-list.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LabelService} from './label.service';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

export class CostMatch {
  id: number;
  matchString: string;
  costType: CostType = CostType.GENERAL_EXPENSE;
  costTypeDescription: string;
  costCharacter: CostCharacter;
  vatType: VatType;
  percentage: number;
  fixedAmount: number;
}

@Injectable({ providedIn: 'root' })
export class CostMatchService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient, private labelService: LabelService) {
  }

  addMatch(costMatch: CostMatch) {
    let body = JSON.stringify(costMatch);
    this.http.post(this.baseURL + '/auth/match', body)
      .subscribe(
        response => {
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  getMatches(): Observable<CostMatch> {

    return this.http.get<CostMatch>(this.baseURL + '/auth/match')
      .pipe(
        catchError(this.handleError));
  }

  deleteMatch(costMatch: CostMatch) {
    this.http.delete(this.baseURL + '/auth/match/' + costMatch.id)
      .subscribe(
        response => {
        },
        error => {
          alert(error);
          console.log(error);
        }
      );
  }
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
