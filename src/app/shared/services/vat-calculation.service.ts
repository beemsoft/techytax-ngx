import { map } from 'rxjs/operators';
import { CostCharacter, CostType, Transaction, VatType } from "./import-list.service";
import { Injectable } from "@angular/core";
import { Activum, ActivumService, ActivumType } from "./activum.service";
import { Observable } from "rxjs";
import { Invoice, InvoiceService } from "./invoice.service";

export class FiscalReport  {
  firstTransactionDate: string;
  latestTransactionDate: string;
  accountNumbers: string[] = [];
  totalCarCosts: number = 0;
  totalTransportCosts: number = 0;
  totalOfficeCosts: number = 0;
  totalFoodCosts: number = 0;
  totalOtherCosts: number = 0;
  investments: Array<Activum>;
}

export class VatReport extends FiscalReport {
  totalVatIn: number = 0;
  totalVatOut: number = 0;
  vatCorrectionForPrivateUsage: number = 0;
  vatSaldo: number = 0;
  sentInvoices: number = 0;
  totalNetIn: number = 0;
}

@Injectable({ providedIn: 'root' })
export class VatCalculationService {
  private invoices: Invoice[];

  constructor(
    private activumService: ActivumService,
    private invoiceService: InvoiceService
  ) {}

  static applyVat(transaction:Transaction, vatType:number): Transaction {
    transaction.amountNet = Math.round((transaction.amount / (1 + (vatType / 100))) * 100) / 100;
    transaction.amountVat = Math.round((transaction.amount - transaction.amountNet) * 100 ) / 100;
    return transaction;
  }

  static applyPercentage(transaction:Transaction, percentage:number): Transaction {
    transaction.amountNet = Math.round(transaction.amountNet * percentage) / 100;
    transaction.amountVat = Math.round(transaction.amountVat * percentage) / 100;
    return transaction
  }

  static applyFixedAmount(transaction: Transaction, fixedAmount: number): Transaction {
    transaction.amountNet = fixedAmount;
    // @ts-ignore
    if (VatType[transaction.costMatch.vatType] === VatType.HIGH) {
      transaction.amountVat = Math.round(fixedAmount * 21) / 100;
    } else {
      // @ts-ignore
      if (VatType[transaction.costMatch.vatType] === VatType.LOW) {
        transaction.amountVat = Math.round(fixedAmount * 9) / 100;
      }
    }
    return transaction;
  }

  calculateTotalVat(transactions: Array<Transaction>): Observable<VatReport> {
    let totalVatOut: number = 0;
    let totalVatIn: number = 0;
    let sentInvoices: number = 0;
    let totalCarCosts: number = 0, totalTransportCosts: number = 0, totalOfficeCosts: number = 0,
      totalFoodCosts: number = 0, totalOtherCosts: number = 0;
    let investments = new Array<Activum>();

    function applyVat(transaction: Transaction): Transaction {
      if (VatType[transaction.costMatch.vatType] == JSON.stringify(VatType.HIGH)) {
        return VatCalculationService.applyVat(transaction, 21);
      } else if (VatType[transaction.costMatch.vatType] == JSON.stringify(VatType.LOW)) {
        return VatCalculationService.applyVat(transaction, 9);
      } else {
        return VatCalculationService.applyVat(transaction, 0);
      }
    }

    // let vatFreeCalculation = true;
    // for (let i = 0; i < transactions.length; i++) {
    //   if (transactions[i].costMatch.vatType !== null) {
    //     vatFreeCalculation = false;
    //   }
    // }
    // console.log('VAT free calculation: ' + vatFreeCalculation);
    let vatFreeCalculation = false;

    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i];
      if (transaction.costCharacter === CostCharacter.BUSINESS || transaction.costCharacter === CostCharacter.BOTH) {
        let vatOut = 0;
        let vatIn = 0;
        switch (transaction.costType['id']) {
          case CostType.BUSINESS_FOOD:
            transaction = VatCalculationService.applyVat(transaction, 0);
            totalFoodCosts += transaction.amountNet;
            break;
          case CostType.INVOICE_PAID:
            transaction = VatCalculationService.applyVat(transaction, 21);
            sentInvoices += transaction.amountNet;
            vatOut = 0;
            vatIn = transaction.amountVat;
            break;
          case CostType.GENERAL_INCOME:
            console.log("TODO: Handle general income")
            break;
          default:
            if (transaction.costMatch != null && transaction.costMatch.vatType != null) {
              if (transaction.costMatch.fixedAmount > 0) {
                transaction = VatCalculationService.applyFixedAmount(transaction, transaction.costMatch.fixedAmount);
              } else {
                transaction = applyVat(transaction);
                if (transaction.costMatch.percentage > 0) {
                  transaction = VatCalculationService.applyPercentage(transaction, transaction.costMatch.percentage);
                }
              }
              vatOut = transaction.amountVat;
              if (transaction.costType['id'] === CostType.BUSINESS_CAR) {
                totalCarCosts += transaction.amountNet;
              } else if (transaction.costType['id'] === CostType.TRAVEL_WITH_PUBLIC_TRANSPORT) {
                totalTransportCosts += transaction.amountNet;
              } else if (transaction.costType['id'] === CostType.OFFICE) {
                totalOfficeCosts += transaction.amountNet;
              } else if (transaction.costType['id'] === CostType.OFFICE_DISCOUNT) {
                totalOfficeCosts -= transaction.amountNet;
              } else if (transaction.costType['id'] === CostType.GENERAL_EXPENSE) {
                totalOtherCosts += transaction.amountNet;
              } else if (transaction.costType['id'] === CostType.INVESTMENT) {
                let activum = new Activum();
                activum.balanceType = ActivumType.MACHINERY;
                activum.description = transaction.description;
                activum.startDate = transaction.dateFormatted;
                activum.nofYearsForDepreciation = 3;
                activum.purchaseDate = transaction.dateFormatted;
                activum.purchasePrice = transaction.amountNet;
                investments.push(activum);
              }
            } else {
              if (vatFreeCalculation && transaction.costType['id'] === CostType.GENERAL_EXPENSE) {
                totalOtherCosts += transaction.amount;
              }
              transaction.amountNet = 0;
              transaction.amountVat = 0;
            }
            break;
        }
        totalVatOut += vatOut;
        totalVatIn += vatIn;
      } else {
        transaction.amountNet = 0;
        transaction.amountVat = 0;
      }
    }

    return this.activumService.getActivumCar().pipe(
      map(
        carData => {
          let vatReport = new VatReport();

          this.invoiceService.getIncomeForLatestPeriod()
            .subscribe(
              invoiceData => {
                this.invoices = invoiceData;
                this.invoices.forEach((invoice: Invoice) => {
                  let netIn = invoice.unitsOfWork * invoice.project.rate;
                  vatReport.totalNetIn += netIn;
                  vatReport.totalVatIn += netIn * .21;
                });
                vatReport.totalVatIn = Math.round((totalVatIn + vatReport.totalVatIn) * 100) / 100;
                vatReport.totalNetIn = Math.round(vatReport.totalNetIn * 100) / 100;
                vatReport.vatCorrectionForPrivateUsage = carData ? carData.vatCorrectionForPrivateUsage : 0;
                vatReport.totalVatOut = Math.round(totalVatOut);
                vatReport.vatSaldo = Math.round(vatReport.totalVatIn - vatReport.totalVatOut + vatReport.vatCorrectionForPrivateUsage);
                vatReport.sentInvoices = Math.round((vatReport.totalNetIn > 0 ? vatReport.totalNetIn : sentInvoices) * 100) / 100;
                vatReport.totalOfficeCosts = Math.round(totalOfficeCosts * 100) / 100;
                vatReport.totalCarCosts = Math.round(totalCarCosts * 100) / 100;
                vatReport.totalTransportCosts = Math.round(totalTransportCosts * 100) / 100;
                vatReport.totalFoodCosts = Math.round(totalFoodCosts * 100) / 100;
                vatReport.totalOtherCosts = Math.round(totalOtherCosts * 100) / 100;
                vatReport.investments = investments;
              },
              error => {
                alert(error);
                console.log(error);
              },
              () => console.log('Invoices retrieved')
            );

          return vatReport;
        }
      ));
  }
}
