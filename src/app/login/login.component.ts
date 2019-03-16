import {Component, EventEmitter, Output} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import { throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.css']
})

export class LoginComponent {
  private baseURL: string = 'http://localhost:8080';
  @Output() userChanged2: EventEmitter<string> = new EventEmitter<string>();
  private loggedIn = false;

  constructor(private http: HttpClient, private router: Router, private location: Location) {}

  login(event: any, username: string, password: string) {
    event.preventDefault();
    let body = JSON.stringify({ username, password });
    // contentHeaders.set('Content-Type', 'application/json;charset=UTF-8');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    this.http.post(this.baseURL+'/auth', body, httpOptions)
      .pipe(
        catchError(this.handleError)).subscribe(
      response => {
            localStorage.setItem('jwt', response["token"]);
            this.loggedIn = true;
            this.userChanged2.emit(username);
      }
    );
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  signup(event: any) {
    event.preventDefault();
  }

  isHidden() {
    let list = ["/register"],
        route = this.location.path();

    return (list.indexOf(route) > -1) || this.loggedIn;
  }

  handleUserChange2() {
    this.userChanged2.emit("niet ingelogd");
    this.loggedIn = false;
    this.router.navigateByUrl('/')
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}
