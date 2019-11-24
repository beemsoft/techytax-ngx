import {Component, OnInit} from '@angular/core';
import {LabelService} from '../shared/services/label.service';
import {Invoice, InvoiceService} from '../shared/services/invoice.service';
import {Project, ProjectService} from '../shared/services/project.service';
import * as moment from 'moment';

@Component({
  templateUrl: 'send-invoice.component.html'
})
export class SendInvoiceComponent implements OnInit {

  projects: Project[];
  invoice: Invoice;

  constructor(
    private labelService: LabelService,
    private invoiceService: InvoiceService,
    private projectService: ProjectService
  ) {
    this.invoice = new Invoice();
    let invoiceMonth = moment().locale('nl').subtract(1,'months');
    this.invoice.month = invoiceMonth.format("MMMM");
    let prefix = "";
    if (invoiceMonth.month() < 9) {
      prefix = "0";
    }
    this.invoice.invoiceNumber = invoiceMonth.year() + prefix + (invoiceMonth.month() + 1) + "01";
  }

  ngOnInit() {
    this.projectService.getProjects()
      .subscribe(
        (projects) => { this.projects = projects;},
        error => {
          alert(error);
          console.log(error);
        },
        () => console.log('Projects retrieved')
      )
  }

  onChangeEvent(ev) {
    this.invoice.project = ev;
  }

  sendInvoice() {
     console.log("Send invoice: " + JSON.stringify(this.invoice));
  }

}
