import { Component, OnInit, signal } from '@angular/core';
import {
  CostCharacter,
  CostType,
  ImportListService,
  Transaction,
  VatType
} from '../shared/services/import-list.service';
import { CostMatch, CostMatchService } from '../shared/services/cost-match.service';
import { LabelService } from '../shared/services/label.service';
import { VatCalculationService, VatReport } from '../shared/services/vat-calculation.service';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import {CostService} from "@app/shared/services/cost.service";
import {first} from "rxjs/operators";
import { ShellService } from '@app/shell/shell.service';

@Component({
  standalone: false, templateUrl: 'vat.component.html'})
export class VatComponent implements OnInit {
  uploadedFile: File;
  importedText: string;
  public vatReport = signal<VatReport>(new VatReport());
  private costMatches;
  transactionsLoaded = signal(0);
  private transactionsFromCosts: Array<Transaction> = [];
  private transactions: Array<Transaction> = this.transactionsFromCosts;
  transactionsUnmatched = signal<Array<Transaction>>([]);
  public columnsToDisplay: string[] = ['date', 'description', 'matchString', 'costType', 'costCharacter', 'matchPercentage', 'matchFixedAmount', 'vatType', 'amount', 'amountNet', 'vatOut'];
  dataSource = signal<any>(null);
  costTypeList = [];
  costCharacterList = [];
  vatTypeList = [];
  private costs = signal<any[] | null>(null);

  constructor(
    private importListService: ImportListService,
    private costMatchService: CostMatchService,
    private labelService: LabelService,
    private vatCalculationService: VatCalculationService,
    private costService: CostService,
    public shellService: ShellService
  ) {
    this.uploadedFile = null;
  }

  ngOnInit() {
    this.costMatchService.getMatches()
      .subscribe({
        next: costMatchData => {
          this.costMatches = costMatchData;
        },
        error: error => {
          console.error(error);
        },
        complete: () => console.log('Costmatches retrieved')
      });
    for (const costType in CostType) {
      if (parseInt(costType, 10) >= 0) {
        this.costTypeList.push({key: costType, value: this.labelService.get(CostType[costType])});
      }
    }
    for (const costCharacter in CostCharacter) {
      if (parseInt(costCharacter, 10) >= 0) {
        this.costCharacterList.push({key: costCharacter, value: this.labelService.get(CostCharacter[costCharacter])});
      }
    }
    for (const vatType in VatType) {
      if (parseInt(vatType, 10) >= 0) {
        this.vatTypeList.push({key: vatType, value: this.labelService.get(VatType[vatType])});
      }
    }
    this.costService.getVatCosts()
        .pipe(first())
        .subscribe(costs => {
          this.costs.set(costs as unknown as any[]);
          console.log(this.costs);
          for (const cost in costs) {
            let transaction = new Transaction();
            transaction.amountNet = costs[cost].amount;
            transaction.amountVat = costs[cost].vat;
            transaction.amount = transaction.amountNet + transaction.amountVat;
            transaction.date = moment(costs[cost].date, 'YYYY-MM-DD') ;
            transaction.costType = costs[cost].costType;
            transaction.description = costs[cost].description;
            this.transactionsFromCosts.push(transaction);
            console.log(costs[cost]);
          }
        });
  }

  displayVatTypeSelector(transaction: Transaction) {
    return transaction.costType !== CostType.BUSINESS_FOOD;
  }

  private checkTransactions(): void {
    const unmatched: Array<Transaction> = [];
    const report = this.vatReport();
    let latestTransactionDate: moment.Moment = this.transactions[0].date;
    let firstTransactionDate: moment.Moment = this.transactions[0].date;
    for (const item of this.transactions) {
      if (item.costCharacter === CostCharacter.UNKNOWN) {
        console.log('Unmatched transaction: ' + item.description);
        unmatched.push(item);
      }
      if (item.date.isAfter(latestTransactionDate)) {
        latestTransactionDate = item.date;
      }
      if (item.date.isBefore(firstTransactionDate)) {
        firstTransactionDate = item.date;
      }
      if (!report.accountNumbers.includes(item.accountNumber)) {
        report.accountNumbers.push(item.accountNumber);
      }
      item.costTypeDescription = CostType[item.costType['id']];
    }
    this.transactionsUnmatched.set(unmatched);
    report.firstTransactionDate = firstTransactionDate.format('YYYY-MM-DD');
    report.latestTransactionDate = latestTransactionDate.format('YYYY-MM-DD');
    this.vatReport.set({...report});

    for (const item of unmatched) {
      if (item.description.toLowerCase().indexOf('bol.com') > -1) {
        const index = item.description.search(/[0-9][0-9]-[0-9][0-9]-[0-9][0-9]-[0-9][0-9]-[0-9][0-9]/);
        const bolProductKey = item.description.substring(index, index + 14);
        console.log('Check bol.com order: https://www.bol.com/nl/rnwy/account/order_details/' + bolProductKey.replaceAll('-', ''));
      } else if (item.description.toLowerCase().indexOf('google play store') > -1) {
        console.log('Check Google Play Store activity: https://pay.google.com/gp/w/home/activity?hl=nl');
      }
    }
  }

  fileChangeEvent(fileInput: any) {
    this.uploadedFile = fileInput.target.files[0];
    const reader = new FileReader();
    reader.onload = file => {
      const contents: any = file.target;
      this.importedText = contents.result;
      this.transactions = this.transactions.concat(this.importListService.convert(this.importedText));
      this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
      this.transactionsLoaded.set(this.transactions.length);
      if (this.transactionsLoaded()) {
        this.updateTotalVat();
      }
    };
    reader.readAsText(this.uploadedFile);

  }

  public addMatch(transaction: Transaction): void {
    const costMatch = new CostMatch();
    costMatch.matchString = transaction.matchString;
    costMatch.costCharacter = transaction.costCharacter;
    costMatch.costType = transaction.costType;
    costMatch.vatType = transaction.vatType;
    costMatch.percentage = transaction.percentage;
    costMatch.fixedAmount = transaction.fixedAmount;
    this.costMatchService.addMatch(costMatch)
      .subscribe(() => {
        transaction.costMatch = costMatch;
        this.costMatches = (this.costMatches as CostMatch[]).concat(transaction.costMatch);
        this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
        this.updateTotalVat();
      });
  }

  public match(): void {
    this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
    this.updateTotalVat();
  }

  public addMatchDisabled(transaction: Transaction): boolean {
    return !transaction.matchString || transaction.matchString.length < 2;
  }

  public addManualTransaction(): void {
    const transaction = new Transaction();
    transaction.date = moment();
    this.transactions.push(transaction);
    this.dataSource.set(new MatTableDataSource(this.transactions));
  }

  public removeMatch(transaction: Transaction): void {
    this.costMatchService.deleteMatch(transaction.costMatch)
      .subscribe( () => {
        this.costMatches.forEach((item, index) => {
          if (item.id === transaction.costMatch.id) { this.costMatches.splice(index, 1); }
        });
        transaction.costMatch = null;
        this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
        this.updateTotalVat();
      });
  }

  private updateTotalVat(): void {
    this.vatCalculationService.calculateTotalVat(this.transactions)
      .subscribe({
        next: vatReport => {
          this.vatReport.set(vatReport);
          this.checkTransactions();
          this.dataSource.set(new MatTableDataSource(this.transactions));
        },
        error: error => {
          console.error(error);
        }
      });
  }
}
