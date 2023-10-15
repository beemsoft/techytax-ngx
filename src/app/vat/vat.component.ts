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
import { FiscalReport, VatCalculationService, VatReport } from '../shared/services/vat-calculation.service';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({ templateUrl: 'vat.component.html'})
export class VatComponent implements OnInit {
  uploadedFile: File;
  importedText: string;
  public vatReport: VatReport = new VatReport();
  public fiscalReport: FiscalReport;
  private costMatches;
  transactionsLoaded: number = 0;
  transactionsUnmatched: number;
  private transactions: Array<Transaction> = [];
  public columnsToDisplay: string[] = ['date', 'description', 'matchString', 'costType', 'costCharacter', 'matchPercentage', 'matchFixedAmount', 'vatType', 'amount', 'amountNet', 'vatOut'];
  dataSource;
  costTypes = CostType;
  costTypeList = [];
  costCharacters = CostCharacter;
  costCharacterList = [];
  vatTypes = VatType;
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
    for (let costType in CostType) {
      let isValueProperty = parseInt(costType, 10) >= 0;
      if (isValueProperty) {
        this.costTypeList.push({key: costType, value: this.labelService.get(CostType[costType])});
      }
    }
    for (let costCharacter in CostCharacter) {
      let isValueProperty = parseInt(costCharacter, 10) >= 0;
      if (isValueProperty) {
        this.costCharacterList.push({key: costCharacter, value: this.labelService.get(CostCharacter[costCharacter])});
      }
    }
    for (let vatType in VatType) {
      let isValueProperty = parseInt(vatType, 10) >= 0;
      if (isValueProperty) {
        this.vatTypeList.push({key: vatType, value: this.labelService.get(VatType[vatType])});
      }
    }
  }

  displayVatTypeSelector(transaction: Transaction) {
    return transaction.costType != CostType.BUSINESS_FOOD;
  }

  private checkTransactions(): void {
    this.transactionsUnmatched = 0;
    let latestTransactionDate: moment.Moment = this.transactions[0].date;
    let firstTransactionDate: moment.Moment = this.transactions[0].date;
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].costCharacter === CostCharacter.UNKNOWN) {
        console.log('Unmatched transaction: ' + this.transactions[i].description);
        this.transactionsUnmatched++;
      }
      if (this.transactions[i].date.isAfter(latestTransactionDate)) {
        latestTransactionDate = this.transactions[i].date;
      }
      if (this.transactions[i].date.isBefore(firstTransactionDate)) {
        firstTransactionDate = this.transactions[i].date;
      }
      if (!this.vatReport.accountNumbers.includes(this.transactions[i].accountNumber)) {
        this.vatReport.accountNumbers.push(this.transactions[i].accountNumber);
      }
      this.transactions[i].costTypeDescription = CostType[this.transactions[i].costType['id']];
    }
    this.vatReport.firstTransactionDate = firstTransactionDate.format('YYYY-MM-DD');
    this.vatReport.latestTransactionDate = latestTransactionDate.format('YYYY-MM-DD');
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
        this.costMatches = (<CostMatch[]>this.costMatches).concat(transaction.costMatch);
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
          if (item.id === transaction.costMatch.id) this.costMatches.splice(index,1);
        });
        transaction.costMatch = null;
        this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
        this.updateTotalVat();
      })
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
