import { Component, Input } from '@angular/core';
import { VatReport } from '../shared/services/vat-calculation.service';
import { FiscalOverviewService } from '../shared/services/fiscal-overview.service';

@Component({
  selector: 'vat-report',
  templateUrl: 'vat-report.component.html'
})
export class VatReportComponent {
  @Input() vatReport: VatReport;

  constructor(
    private fiscalOverviewService: FiscalOverviewService) {
  };

  public sendFiscalData(): void {
    console.log('Sending Fiscal data');
    this.fiscalOverviewService.sendFiscalData(this.vatReport)
      .subscribe(() => {
        console.log('Sent!');
      })
  }
}
