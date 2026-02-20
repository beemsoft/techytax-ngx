import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService, DockerService } from '@app/_services';

@Component({
  standalone: false, templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;
    remark: string;

    private remarks = [
        { month: 0, day: 1, text: "Gelukkig nieuwjaar! Tijd om die goede voornemens (en je administratie) op te pakken." },
        { month: 0, day: 31, text: "Laatste dag voor de BTW-aangifte van Q4! Geen paniek, we hebben nog... oh wacht." },
        { month: 1, day: 20, text: "Bijna maart, tijd om die inkomstenbelasting-puzzelstukjes te verzamelen!" },
        { month: 3, day: 1, text: "1 april! De Belastingdienst maakt het wél leuker vandaag... grapje natuurlijk." },
        { month: 3, day: 30, text: "Bijna tijd voor de inkomstenbelasting. Heb je alle bonnetjes al gevonden onder de bank?" },
        { month: 4, day: 1, text: "Mei is begonnen! De maand van het vakantiegeld (en hopelijk een mooie winst)." },
        { month: 11, day: 25, text: "Fijne kerst! Laat de cijfers even voor wat ze zijn, de kalkoen wacht." },
        { month: 11, day: 31, text: "Oliebollen en balans opmaken. Een klassieke combinatie." }
    ];

    private genericRemarks = [
        "Onthoud: een goede administratie is het halve werk. De andere helft is koffie.",
        "BTW: Belasting Toegevoegde Waanzin? Nee, Waarde natuurlijk!",
        "Geld maakt niet gelukkig, maar een kloppende balans wel.",
        "Factureren is ook een sport. En jij gaat voor goud!",
        "Je administratie bijhouden is net als sporten: het begin is het lastigst.",
        "Sst... hoor je dat? Dat is het geluid van een georganiseerde administratie.",
        "De fiscus slaapt nooit, maar gelukkig helpt TechyTax je een handje.",
        "Een opgeruimde administratie is een opgeruimd hoofd."
    ];

    constructor(
        private accountService: AccountService,
        private dockerService: DockerService
    ) {
        this.user = this.accountService.userValue;
        this.setRemark();
    }

    private setRemark() {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();

        const specialRemark = this.remarks.find(r => r.month === month && r.day === day);
        if (specialRemark) {
            this.remark = specialRemark.text;
        } else {
            // Quarterly VAT deadlines (simplified)
            if (day > 20 && [0, 3, 6, 9].includes(month)) {
                this.remark = "De BTW-deadline nadert... Heb je alles al ingevoerd?";
            } else {
                const index = (day + month) % this.genericRemarks.length;
                this.remark = this.genericRemarks[index];
            }
        }
    }

    ngOnInit() {
        this.dockerService.checkUpdates().subscribe();
    }
}
