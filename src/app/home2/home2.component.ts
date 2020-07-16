import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home2.component.html' })
export class Home2Component {
    user: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}
