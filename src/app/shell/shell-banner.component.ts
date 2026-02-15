import { Component } from '@angular/core';
import { ShellService } from './shell.service';

@Component({
    selector: 'shell-banner',
    templateUrl: './shell-banner.component.html',
    styles: [`
        .stealth-banner {
            background-color: #2c3e50;
            color: white;
            padding: 10px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .license-banner {
            padding: 8px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .license-banner.trial {
            background-color: #e67e22;
            color: white;
        }
        .license-banner.expired {
            background-color: #c0392b;
            color: white;
        }
        .license-banner a {
            color: white;
            text-decoration: underline;
        }
        .stealth-banner button {
            margin-left: 10px;
        }
    `],
    standalone: false
})
export class ShellBannerComponent {
    constructor(public shellService: ShellService) {}
}
