import { Observable, throwError as observableThrowError } from 'rxjs';
import { CostCharacter, CostType, Transaction, VatType } from './import-list.service';
import { HttpClient } from '@angular/common/http';
import { LabelService } from './label.service';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
    return this.http.post(this.baseURL + '/auth/match', costMatch)
      .pipe(catchError(this.handleError));
  }

  getMatches(): Observable<CostMatch> {
    return this.http.get<CostMatch>(this.baseURL + '/auth/match')
      .pipe(
        catchError(this.handleError));
  }

  getById(id: number): Observable<CostMatch> {
    return this.http.get<CostMatch>(this.baseURL+'/auth/match/'+  id)
      .pipe(catchError(this.handleError));
  }

  deleteById(id: number) {
    return this.http.delete(this.baseURL+'/auth/match/'+id)
      .pipe(catchError(this.handleError));
  }

  deleteMatch(costMatch: CostMatch) {
    return this.http.delete(this.baseURL + '/auth/match/' + costMatch.id)
      .pipe(catchError(this.handleError));
  }

  updateMatch(costMatch: CostMatch) {
    let url = this.baseURL+'/auth/match';
    return this.http.put(url, costMatch)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      (typeof error === 'string') ? error :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
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
