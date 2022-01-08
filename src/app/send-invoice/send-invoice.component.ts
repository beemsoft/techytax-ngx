import { Component, OnInit } from '@angular/core';
import { Invoice, InvoiceService } from '../shared/services/invoice.service';
import { Project, ProjectService } from '../shared/services/project.service';
import * as moment from 'moment';
import { RegisterService, Registration } from '../shared/services/register.service';
import { ActivityService } from '@app/shared/services/activity.service';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'send-invoice.component.html' })
export class SendInvoiceComponent implements OnInit {

  projects: Project[];
  invoice: Invoice;
  subTotal: number;
  registration: Registration;
  invoiceType = "factuur";
  approveInvoice: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
    private registerService: RegisterService,
    private activityService: ActivityService,
    private alertService: AlertService
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
    this.registerService.getRegistration()
      .subscribe((registration) => {
          this.registration = registration;
          this.projectService.getCurrentProjects()
            .pipe(first())
            .subscribe(
              (projects) => {
                this.projects = projects;
                if (this.projects.length === 1) {
                  this.selectProject(this.projects[0])
                }
              },
              error => {
                this.alertService.error(error);
              });
        },
        error => {
          this.alertService.error(error);
        });
  }

  onChangeEvent(ev) {
    this.selectProject(ev);
  }

  isButtonDisabled() {
    return !this.approveInvoice
      || this.invoice.unitsOfWork == undefined
      || (this.invoiceType == "factuur" && this.invoice.unitsOfWork < 1)
      || (this.invoiceType == "creditnota" && (this.invoice.unitsOfWork > -1
       || (this.invoice.originalInvoiceNumber == undefined || this.invoice.originalInvoiceNumber.length < 8)));
  }

  checkUnitsOfWork() {
    if (this.invoice.unitsOfWork < 0) {
      this.invoiceType = "creditnota"
    } else {
      this.invoiceType = "factuur"
    }
    this.updateHtmlText()
  }

  updateDescription() {
    this.updateHtmlText()
  }

  private selectProject(project) {
    this.invoice.project = project;
    this.updateHtmlText()
    this.activityService.getActivitiesForPreviousMonth(project.id)
      .subscribe(activities => {
        console.log(JSON.stringify(activities));
        let totalHours = 0;
        activities.forEach(activity => {
          totalHours += activity.hours;
        })
        this.invoice.unitsOfWork = totalHours;
        this.checkUnitsOfWork();
        this.subTotal = totalHours * this.invoice.project.rate;
        this.invoice.revenue = this.subTotal * (this.invoice.project.revenuePerc ? this.invoice.project.revenuePerc / 100 : 1);
      })
  }

  updateHtmlText() {
    this.invoice.htmlText = "Beste " + this.invoice.project.customer.contact + ", <br><br>Hierbij stuur ik je " + this.invoiceType + " " + this.invoice.invoiceNumber +
      ".<br><br>Met vriendelijke groet,<br>" + this.getFullName();
  }

  private getFullName() {
    const personalData = this.registration.personalData;
    return personalData.firstName.concat(' ', personalData.prefix != null ? personalData.prefix.concat(' ') : '', personalData.surname);
  }

  sendInvoice() {
     console.log("Send invoice: " + JSON.stringify(this.invoice));
     this.invoiceService.sendInvoice(this.invoice);
  }

}
