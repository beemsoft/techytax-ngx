import { Component, OnInit, signal } from '@angular/core';
import { LabelService } from '../shared/services/label.service';
import { FiscalOverview, FiscalOverviewService } from '../shared/services/fiscal-overview.service';

@Component({
  standalone: false,
  templateUrl: 'fiscal-overview.component.html'
})
export class FiscalOverviewComponent implements OnInit {
  fiscalOverview = signal<FiscalOverview>(null);

  constructor(
    private labelService: LabelService,
    private fiscalOverViewService: FiscalOverviewService
  ) {
  }

  ngOnInit() {
    this.fiscalOverViewService.getFiscalOverview()
      .subscribe({
        next: (fiscalOverview) => {
          this.fiscalOverview.set(fiscalOverview);
        },
        error: error => {
          alert(error);
          console.log(error);
        },
        complete: () => console.log('Fiscal overview retrieved')
      });
  }
}
