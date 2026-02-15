import { Component, OnInit, signal } from '@angular/core';
import { Invoice, InvoiceService } from '../shared/services/invoice.service';
import { Project, ProjectService } from '../shared/services/project.service';
import moment from 'moment';
import { RegisterService, Registration } from '../shared/services/register.service';
import { ActivityService } from '@app/shared/services/activity.service';
import { AlertService } from '@app/_services';
import { first, switchMap } from 'rxjs/operators';

@Component({ standalone: false, templateUrl: 'send-invoice.component.html' })
export class SendInvoiceComponent implements OnInit {

  projects = signal<Project[]>([]);
  invoice = signal<Invoice>(new Invoice());
  subTotal = signal<number>(0);
  registration = signal<Registration>(null);
  invoiceType = signal<string>("factuur");
  constructor(
    private invoiceService: InvoiceService,
    private projectService: ProjectService,
    private registerService: RegisterService,
    private activityService: ActivityService,
    private alertService: AlertService
) {
    const inv = new Invoice();
    let invoiceMonth = moment().locale('nl').subtract(1, 'months');
    inv.month = invoiceMonth.format("MMMM");
    let prefix = "";
    if (invoiceMonth.month() < 9) {
      prefix = "0";
    }
    inv.invoiceNumber = invoiceMonth.year() + prefix + (invoiceMonth.month() + 1) + "01";
    this.invoice.set(inv);
  }

  ngOnInit() {
    this.registerService.getRegistration()
      .pipe(
        switchMap(registration => {
          this.registration.set(registration);
          return this.projectService.getCurrentProjects().pipe(first());
        })
      )
      .subscribe({
        next: (projects) => {
          this.projects.set(projects);
          if (projects.length === 1) {
            this.selectProject(projects[0]);
          }
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  onChangeEvent(ev) {
    this.selectProject(ev);
  }

  isButtonDisabled() {
    const inv = this.invoice();
    return inv.unitsOfWork == undefined
      || (this.invoiceType() == "factuur" && inv.unitsOfWork < 1)
      || (this.invoiceType() == "creditnota" && (inv.unitsOfWork > -1
       || (inv.originalInvoiceNumber == undefined || inv.originalInvoiceNumber.length < 8)));
  }

  checkUnitsOfWork() {
    if (this.invoice().unitsOfWork < 0) {
      this.invoiceType.set("creditnota");
    } else {
      this.invoiceType.set("factuur");
    }
    this.updateHtmlText()
  }

  updateDescription() {
    this.updateHtmlText()
  }

  private selectProject(project) {
    const inv = this.invoice();
    inv.project = project;
    this.invoice.set({...inv});
    this.updateHtmlText()
    this.activityService.getActivitiesForPreviousMonth(project.id)
      .subscribe({
        next: activities => {
          console.log(JSON.stringify(activities));
          let totalHours = 0;
          activities.forEach(activity => {
            totalHours += activity.hours;
          })
          const updatedInv = this.invoice();
          updatedInv.unitsOfWork = totalHours;
          this.invoice.set({...updatedInv});
          this.checkUnitsOfWork();
          this.subTotal.set(totalHours * project.rate);
          updatedInv.revenue = this.subTotal() * (project.revenuePerc ? project.revenuePerc / 100 : 1);
          this.invoice.set({...updatedInv});
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  updateHtmlText() {
    const inv = this.invoice();
    inv.htmlText = "Beste " + inv.project.customer.contact + ", <br><br>Hierbij stuur ik je " + this.invoiceType() + " " + inv.invoiceNumber +
      ".<br><br>Met vriendelijke groet,<br>" + this.getFullName();
    this.invoice.set({...inv});
  }

  private getFullName() {
    const personalData = this.registration().personalData;
    return personalData.firstName.concat(' ', personalData.prefix != null ? personalData.prefix.concat(' ') : '', personalData.surname);
  }

  sendInvoice() {
     console.log("Send invoice: " + JSON.stringify(this.invoice()));
     this.invoiceService.sendInvoice(this.invoice());
  }

}
