import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public currentUser = signal<User | null>(JSON.parse(localStorage.getItem('user')));

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(username, password) {
    return this.http.post<any>(`${environment.apiUrl}/auth`, { username, password })
      .pipe(map(response => {
        const user: User = {
            id: response.id,
            username: response.username,
            password: response.password,
            token: response.token || response.id_token
        };
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        this.currentUser.set(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.userSubject.next(null);
    this.currentUser.set(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/auth/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/auth/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/auth/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue.id) {
          // update local storage
          const user = { ...this.userValue, ...params };
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
          this.currentUser.set(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/auth/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }
}
