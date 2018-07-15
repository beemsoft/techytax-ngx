import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  template: `
      <div>
          <a [routerLink]="['/vat']">btw</a>
          <a [routerLink]="['/login']">login</a>
      </div>
      <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
