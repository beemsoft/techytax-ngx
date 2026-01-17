import {Component, OnInit} from '@angular/core';
import {LabelService} from '../shared/services/label.service';
import { FiscalOverview, FiscalOverviewService } from '../shared/services/fiscal-overview.service';

@Component({
  standalone: false,
  templateUrl: 'fiscal-overview.component.html'
})
export class FiscalOverviewComponent implements OnInit {
  fiscalOverview: FiscalOverview;

  constructor(
    private labelService: LabelService,
    private fiscalOverViewService: FiscalOverviewService
  ) {
  }

  ngOnInit() {
    this.fiscalOverViewService.getFiscalOverview()
      .subscribe(
        (fiscalOverview) => {
          this.fiscalOverview = fiscalOverview;
        },
        error => {
          alert(error);
          console.log(error);
        },
        () => console.log('Fiscal overview retrieved')
      )
  }

}
