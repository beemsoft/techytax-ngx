import {Component, OnInit} from '@angular/core';
import {LabelService} from '../shared/services/label.service';
import {FiscalOverviewService} from '../shared/services/fiscal-overview.service';

@Component({
  templateUrl: 'fiscal-overview.component.html'
})
export class FiscalOverviewComponent implements OnInit {

  constructor(
    private labelService: LabelService,
    private fiscalOverViewService: FiscalOverviewService
  ) {
  }

  ngOnInit() {
    this.fiscalOverViewService.getFiscalOverview()
      .subscribe(
        () => {},
        error => {
          alert(error);
          console.log(error);
        },
        () => console.log('Fiscal overview retrieved')
      )
  }

}
