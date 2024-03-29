import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

export class Registration {
  user: string;
  password: string;
  registrationDate: Date;
  personalData: PersonalData = new PersonalData();
  companyData: CompanyData = new CompanyData();
  fiscalData: FiscalData = new FiscalData();
}

class CompanyData {
  companyName: string;
  address: string;
  zipCode: string;
  city: string;
  accountNumber: string;
  chamberOfCommerceNumber: number;
  jobsInIndividualHealthcareNumber: number;
}

class FiscalData {
  vatNumber: number;
  declarationPeriod: DeclarationPeriod;
}

export enum DeclarationPeriod {
  QUARTERLY,
  YEARLY
}

class PersonalData {
  initials: string;
  firstName: string;
  prefix: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRegistration(): Observable<Registration> {
    return this.http.get<Registration>(this.baseURL + '/auth/register');
  }

  updateRegistration(registration: Registration) {
    const body = JSON.stringify(registration);
    const url = this.baseURL + '/auth/register';
    return this.http.put(url, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return throwError(errMsg);
  }
}
