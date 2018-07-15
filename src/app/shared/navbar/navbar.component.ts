import {Component, EventEmitter, Output} from '@angular/core';
// import {RegisterService} from "../services/register.service";
import {Router} from "@angular/router";

@Component({
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})

export class NavbarComponent {
  @Output() userChanged: EventEmitter<string> = new EventEmitter<string>();
  isIn = false;

  constructor(private router: Router) {}

  toggleState() {
    let bool = this.isIn;
    this.isIn = bool === false;
  }

  logout() {
    this.userChanged.emit("niet ingelogd");
  }

  // editRegistration() {
  //   this.toggleState();
  //   this.router.navigateByUrl('/register-edit');
  // }
  //
  // public deleteRegistration(): void {
  //   this.toggleState();
  //   if (confirm("Weet je zeker dat je je account wilt verwijderen? Alle gegevens worden direct verwijderd.")) {
  //     this.registerService.deleteRegistration();
  //     this.logout();
  //   }
  // }
}
