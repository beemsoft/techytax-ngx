import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <div>
          <a [routerLink]="['/vat']">btw</a>
          <a [routerLink]="['/fiscal-overview']">Fiscaal overzicht</a>
          <a [routerLink]="['/login']">login</a>
      </div>
      <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
