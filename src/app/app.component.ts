import { AccountService } from './_services';
import { User } from './_models';
import { Component, computed } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  standalone: false, selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user$ = computed(() => this.accountService.currentUser());

  constructor(private accountService: AccountService) {
  }

  logout() {
    this.accountService.logout();
  }
}
