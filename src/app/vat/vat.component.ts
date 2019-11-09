import {Component, OnInit, ViewChild} from '@angular/core';
import {CostCharacter, CostType, ImportListService, Transaction} from '../shared/services/import-list.service';
import {CostMatch, CostMatchService} from '../shared/services/cost-match.service';
import {LabelService} from '../shared/services/label.service';
import {FiscalReport, VatCalculationService, VatReport} from '../shared/services/vat-calculation.service';
import {TransactionTableComponent} from './transaction-table.component';

import {MatSort, MatTableDataSource} from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'vat',
  templateUrl: 'vat.component.html',
  styleUrls: ['vat.component.css']
})
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

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private importListService: ImportListService,
    private costMatchService: CostMatchService,
    private labelService: LabelService,
    private vatCalculationService: VatCalculationService,
    public transactionTable: TransactionTableComponent
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
      )
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
    // this.transactionTable.config.filtering.onlyUnknown = this.transactionsUnmatched > 0;
  }

  fileChangeEvent(fileInput: any) {
    this.uploadedFile = fileInput.target.files[0];
    let reader = new FileReader();
    reader.onload = file => {
      let contents: any = file.target;
      this.importedText = contents.result;
      this.transactions = this.transactions.concat(this.importListService.convert(this.importedText));
      this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
      this.transactionsLoaded = this.transactions.length;
      this.transactionTable.length = this.transactions.length;
      if (this.transactionsLoaded) {
        this.updateTotalVat();
        this.transactionTable.data = this.transactions;
        this.transactionTable.rows = this.transactions;
        this.transactionTable.rows = [...this.transactionTable.rows];
        // this.transactionTable.onChangeTable(this.transactionTable.config);
      }
    };
    reader.readAsText(this.uploadedFile);

  }

  public addMatch(transaction: Transaction): void {
    let costMatch = new CostMatch();
    costMatch.matchString = transaction.matchString;
    costMatch.costCharacter = transaction.costCharacter;
    costMatch.costType = transaction.costType;
    costMatch.vatType = transaction.vatType;
    costMatch.percentage = transaction.percentage;
    costMatch.fixedAmount = transaction.fixedAmount;
    transaction.costMatch = costMatch;
    this.costMatchService.addMatch(costMatch);
    this.costMatches = (<CostMatch[]>this.costMatches).concat(transaction.costMatch);
    this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
    this.updateTotalVat();
  }

  public match(): void {
    this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
    this.updateTotalVat();
  }

  public addMatchDisabled(transaction: Transaction): boolean {
    return !transaction.matchString || transaction.matchString.length < 2;
  }

  public addManualTransaction(): void {
    let transaction = new Transaction();
    transaction.date = moment();
    this.transactions.push(transaction);
    this.dataSource = new MatTableDataSource(this.transactions);
  }

  public removeMatch(transaction: Transaction): void {
    this.costMatchService.deleteMatch(transaction.costMatch);
    this.costMatches.forEach((item, index) => {
      if (item.id === transaction.costMatch.id) this.costMatches.splice(index,1);
    });
    transaction.costMatch = null;
    this.transactions = this.costMatchService.match(this.transactions, this.costMatches);
    this.updateTotalVat();
  }

  private updateTotalVat(): void {
    this.vatCalculationService.calculateTotalVat(this.transactions)
      .subscribe(vatReport => {
        this.vatReport = vatReport;
        this.checkTransactions();
        this.dataSource = new MatTableDataSource(this.transactions);
        this.dataSource.sort = this.sort;
      });
  }
}
