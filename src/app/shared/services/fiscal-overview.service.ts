import { throwError as observableThrowError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { VatReport } from './vat-calculation.service';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';

class Income {
  nettoOmzet: number;
}

class Depreciation {
  afschrijvingAuto: number;
  machineryDepreciation: number;
  settlementDepreciation: number;
}

class CompanyCosts {
  carCosts: number;
  carAndTransportCosts: number;
  officeCosts: number;
  otherCosts: number;
}

class ProfitAndLoss {
  income: Income;
  depreciation: Depreciation;
  companyCosts: CompanyCosts;
}

class BalanceDetails {
  beginSaldo: number;
  endSaldo: number;
  totalPurchaseCost: number;
  totalRemainingValue: number;
}

class FiscalPension {
}

export class FiscalOverview {
  jaar: number;
  profitAndLoss: ProfitAndLoss;
  balanceMap: Map<string, BalanceDetails>;
  officeBottomValue: number;
  fiscalPension: FiscalPension;
}

@Injectable({ providedIn: 'root' })
export class FiscalOverviewService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFiscalOverview(): Observable<FiscalOverview> {
    return this.http.get<FiscalOverview>(this.baseURL + '/auth/fiscal-overview')
      .pipe(
        catchError(this.handleError));
  }

  sendFiscalData(vatReport: VatReport) {
    const body = JSON.stringify(vatReport);
    return this.http.post(this.baseURL + '/auth/fiscal-overview', body)
      .pipe(
        catchError(this.handleError));
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
