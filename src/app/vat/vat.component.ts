import { Component, OnInit } from '@angular/core';
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
import * as moment from 'moment';

@Component({ templateUrl: 'vat.component.html'})
export class VatComponent implements OnInit {
  uploadedFile: File;
  importedText: string;
  public vatReport: VatReport = new VatReport();
  private costMatches;
  transactionsLoaded = 0;
  private transactions: Array<Transaction> = [];
  transactionsUnmatched: Array<Transaction> = [];
  public columnsToDisplay: string[] = ['date', 'description', 'matchString', 'costType', 'costCharacter', 'matchPercentage', 'matchFixedAmount', 'vatType', 'amount', 'amountNet', 'vatOut'];
  dataSource;
  costTypeList = [];
  costCharacterList = [];
  vatTypeList = [];

  constructor(
    private importListService: ImportListService,
    private costMatchService: CostMatchService,
    private labelService: LabelService,
    private vatCalculationService: VatCalculationService
  ) {
    this.uploadedFile = null;
  }

  ngOnInit() {
    this.costMatchService.getMatches()
      .subscribe(
        costMatchData => this.costMatches = costMatchData,
        error => {
          alert(error);
          console.log(error);
        },
        () => console.log('Costmatches retrieved')
      );
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
  }

  displayVatTypeSelector(transaction: Transaction) {
    return transaction.costType !== CostType.BUSINESS_FOOD;
  }

  private checkTransactions(): void {
    this.transactionsUnmatched = [];
    let latestTransactionDate: moment.Moment = this.transactions[0].date;
    let firstTransactionDate: moment.Moment = this.transactions[0].date;
    for (const item of this.transactions) {
      if (item.costCharacter === CostCharacter.UNKNOWN) {
        console.log('Unmatched transaction: ' + item.description);
        this.transactionsUnmatched.push(item);
      }
      if (item.date.isAfter(latestTransactionDate)) {
        latestTransactionDate = item.date;
      }
      if (item.date.isBefore(firstTransactionDate)) {
        firstTransactionDate = item.date;
      }
      if (!this.vatReport.accountNumbers.includes(item.accountNumber)) {
        this.vatReport.accountNumbers.push(item.accountNumber);
      }
      item.costTypeDescription = CostType[item.costType['id']];
    }
    this.vatReport.firstTransactionDate = firstTransactionDate.format('YYYY-MM-DD');
    this.vatReport.latestTransactionDate = latestTransactionDate.format('YYYY-MM-DD');

    for (const item of this.transactionsUnmatched) {
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
      this.transactionsLoaded = this.transactions.length;
      if (this.transactionsLoaded) {
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
    this.dataSource = new MatTableDataSource(this.transactions);
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
      .subscribe(vatReport => {
        this.vatReport = vatReport;
        this.checkTransactions();
        this.dataSource = new MatTableDataSource(this.transactions);
      });
  }
}
