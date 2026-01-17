import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({
  standalone: false, templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = signal<any[] | null>(null);

    constructor(
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => {
                this.users.set(users);
            });
    }

    deleteUser(id: string) {
        const user = this.users().find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users.set(this.users().filter(x => x.id !== id));
            });
    }
}
