import { throwError as observableThrowError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { Injectable } from "@angular/core";
import { VatReport } from "./vat-calculation.service";
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

class Income {
  nettoOmzet: number;
}

class Depreciation {
  afschrijvingAuto: number;
  machineryDepreciation: number;
  settlementDepreciation: number;
}

class CompanyCosts {
  carAndTransportCosts: number;
  officeCosts: number;
  otherCosts: number;
}

class ProfitAndLoss {
  income: Income;
  depreciation: Depreciation;
  companyCosts: CompanyCosts;
}

class ActivumTotal {
  beginSaldo: number;
  endSaldo: number;
  totalPurchaseCost: number;
  totalRemainingValue: number;
}

class PassivaMap {
}

class FiscalPension {
}

export class FiscalOverview {
  jaar: number;
  profitAndLoss: ProfitAndLoss;
  activaMap: Map<string, ActivumTotal>;
  officeBottomValue: number;
  passivaMap: PassivaMap;
  fiscalPension: FiscalPension;
}

@Injectable({ providedIn: 'root' })
export class FiscalOverviewService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFiscalOverview(): Observable<FiscalOverview> {
    return this.http.get<FiscalOverview>(this.baseURL+'/auth/fiscal-overview')
      .pipe(
        catchError(this.handleError));
  }

  sendFiscalData(vatReport: VatReport) {
    let body = JSON.stringify(vatReport);
    return this.http.post(this.baseURL+'/auth/fiscal-overview', body)
      .pipe(
        catchError(this.handleError));
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return observableThrowError(errMsg);
  }
}
