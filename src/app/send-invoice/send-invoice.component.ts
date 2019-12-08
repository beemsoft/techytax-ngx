import {Component, OnInit} from '@angular/core';
import {Invoice, InvoiceService} from '../shared/services/invoice.service';
import {Project, ProjectService} from '../shared/services/project.service';
import * as moment from 'moment';
import {RegisterService, Registration} from '../shared/services/register.service';

@Component({
  templateUrl: 'send-invoice.component.html'
})
export class SendInvoiceComponent implements OnInit {

  projects: Project[];
  invoice: Invoice;
  registration: Registration;

  constructor(
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
    private registerService: RegisterService
  ) {
    this.invoice = new Invoice();
    let invoiceMonth = moment().locale('nl').subtract(1, 'months');
    this.invoice.month = invoiceMonth.format("MMMM");
    let prefix = "";
    if (invoiceMonth.month() < 9) {
      prefix = "0";
    }
    this.invoice.invoiceNumber = invoiceMonth.year() + prefix + (invoiceMonth.month() + 1) + "01";
  }

  ngOnInit() {
    this.registerService.getRegistration().subscribe((registration) => {
      this.registration = registration;
      this.projectService.getCurrentProjects()
        .subscribe(
          (projects) => {
            this.projects = projects;
            if (this.projects.length === 1) {
              this.selectProject(this.projects[0])
            }
          },
          error => {
            alert(error);
            console.log(error);
          },
          () => console.log('Projects retrieved')
        )
    });
  }

  onChangeEvent(ev) {
    this.selectProject(ev);
  }

  private selectProject(project) {
    this.invoice.project = project;
    this.invoice.htmlText = "Beste " + this.invoice.project.customer.contact + ", <br><br>Hierbij stuur ik je factuur " + this.invoice.invoiceNumber +
      ".<br><br>Met vriendelijke groet,<br>" + this.getFullName();
  }

  private getFullName() {
    const personalData = this.registration.personalData;
    return personalData.initials.concat(' ', personalData.prefix != null ? personalData.prefix.concat(' ') : '', personalData.surname);
  }

  sendInvoice() {
     console.log("Send invoice: " + JSON.stringify(this.invoice));
     this.invoiceService.sendInvoice(this.invoice);
  }

}
