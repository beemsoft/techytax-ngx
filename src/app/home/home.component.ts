import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService, DockerService } from '@app/_services';

@Component({
  standalone: false, templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;

    constructor(
        private accountService: AccountService,
        private dockerService: DockerService
    ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        this.dockerService.checkUpdates().subscribe();
    }
}
