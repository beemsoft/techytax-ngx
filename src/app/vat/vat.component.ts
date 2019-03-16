import {Component, OnInit, ViewChild} from '@angular/core';
import { ImportListService, Transaction, CostCharacter, CostType } from '../shared/services/import-list.service';
import { CostMatch, CostMatchService } from '../shared/services/cost-match.service';
import { LabelService } from '../shared/services/label.service';
import { VatCalculationService, VatReport, FiscalReport } from '../shared/services/vat-calculation.service';
import { TransactionTableComponent } from './transaction-table.component';

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
  public costMatch: CostMatch;
  private filterString: string;
  public columnsToDisplay: string[] = ['date', 'description', 'matchString', 'costType', 'costCharacter', 'matchPercentage', 'matchFixedAmount', 'vatType', 'amount', 'amountNet', 'vatOut'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private importListService: ImportListService,
    private costMatchService: CostMatchService,
    private labelService: LabelService,
    private vatCalculationService: VatCalculationService,
    public transactionTable: TransactionTableComponent
  ) {
    this.uploadedFile = null;
    this.costMatch = new CostMatch();
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

  displayVatTypeSelector() {
    return this.costMatch.costType != CostType.BUSINESS_FOOD;
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

  handleFilterChange(filterString: string) {
    this.filterString = filterString;
  }

  public addMatch(): void {
    this.costMatch.matchString = this.filterString;
    // this.costMatchService.addMatch(this.costMatch);
    this.costMatches = (<CostMatch[]>this.costMatches).concat(this.costMatch);
    this.transactions = this.costMatchService.match(this.transactions, this.costMatches);

    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].description.indexOf(this.filterString) > -1) {
        this.transactions[i].costTypeDescription = this.labelService.get(CostType[this.transactions[i].costType]);
        this.transactions[i].costCharacterDescription = this.labelService.get(CostCharacter[this.transactions[i].costCharacter]);
      }
    }
    this.updateTotalVat();

    // this.transactionTable.config.filtering.filterString = '';
    // this.transactionTable.onChangeTable(this.transactionTable.config);
  }

  public addMatchDisabled(): boolean {
    return !this.filterString || this.filterString.length < 2;
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
