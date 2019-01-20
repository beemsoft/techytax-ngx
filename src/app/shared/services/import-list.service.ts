import {CsvParseService} from './csv-parse.service';
import {LabelService} from './label.service';
import {CostMatch} from './cost-match.service';
import {Injectable} from '@angular/core';

import * as moment from 'moment';

export enum CostType {
  IGNORE = 0,
  GENERAL_INCOME = 1,
  GENERAL_EXPENSE = 2,
  MACHINERY = 3,
  INVOICE_PAID = 38,
  VAT = 12,
  BUSINESS_FOOD = 13,
  BUSINESS_CAR = 14,
  FROM_SAVINGS_ACCOUNT = 15,
  INVESTMENT = 16,
  TO_SAVINGS_ACCOUNT = 10,
  TO_PRIVATE_ACCOUNT = 17,
  TRAVEL_WITH_PUBLIC_TRANSPORT = 9,
  FROM_PRIVATE_ACCOUNT = 18,
  INCOME_TAX = 29,
  INCOME_TAX_PAID_BACK = 30,
  ROAD_TAX = 31,
  INTEREST = 33,
  OFFICE = 41,
  OFFICE_DISCOUNT = 45
}

enum CsvType {
  ING,
  ABN_AMRO,
  KNAB,
  OV_CHIPKAART
}

export enum CostCharacter {
  UNKNOWN = 0,
  BUSINESS = 1,
  PRIVATE = 2,
  BOTH = 3,
  IGNORE = 4
}

export enum VatType {
  NONE,
  LOW,
  HIGH
}

export class Transaction {
  accountNumber: string;
  date: moment.Moment;
  amount: number;
  amountVat: number;
  amountNet: number;
  description: string;
  costMatch: CostMatch;
  costType: CostType;
  costTypeDescription: string;
  costCharacter: CostCharacter;
  costCharacterDescription: string;

  get dateFormatted(): string {
    return this.date.format('YYYY-MM-DD');
  }

  get amountFormatted(): string {
    return new Intl.NumberFormat('nl', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.amount);
  }
}

@Injectable()
export class ImportListService {
  transactions: Transaction[] = [];

  constructor(public csvParseService: CsvParseService, private labelService: LabelService) {
  }

  get(): Object[] {
    return this.transactions;
  }

  convert(csvFile: string): Transaction[] {
    let transaction: Transaction;
    let csvLines: string[][];
    csvLines = this.csvParseService.csvToArray(csvFile, ',');
    let csvType: CsvType;

    this.transactions = [];
    if (csvLines[0][1] !== undefined && csvLines[0][1].indexOf('Naam / Omschrijving') == 0) {
      csvType = CsvType.ING;
      csvLines.shift();
    } else {
      csvLines = this.csvParseService.csvToArray(csvFile, ';');
      if (csvLines[0][1] !== undefined && csvLines[0][1].indexOf('Check') == 0) {
        csvType = CsvType.OV_CHIPKAART;
        csvLines.shift();
      } else {
        csvLines = this.csvParseService.csvToArray(csvFile, '\t');
        csvType = CsvType.ABN_AMRO;
      }
    }

    csvLines.forEach(line => {
      let description: string;
      if (line.length > 1) {
        transaction = new Transaction();

        // TODO: add Knab: https://github.com/beemsoft/techytax-xbrl/blob/master/techytax-web/src/main/java/org/techytax/importing/helper/KnabTransactionReader.java
        switch (csvType) {
          case CsvType.ING: transaction.date = moment(line[0], 'YYYYMMDD'); break;
          case CsvType.ABN_AMRO: transaction.date = moment(line[2], 'YYYYMMDD'); break;
          case CsvType.OV_CHIPKAART: transaction.date = moment(line[0], 'DD-MM-YYYY'); break;
        }

        if (csvType === CsvType.ING) {
          transaction.accountNumber = line[2];
          transaction.amount = Number.parseFloat(line[6].replace(',', '.'));
          if (line[5] === 'Af') {
            transaction.costType = CostType.GENERAL_EXPENSE;
          } else {
            transaction.costType = CostType.GENERAL_INCOME;
          }
          description = line[1];
          if (line[8]) {
            description = description.concat(' ', line[8]);
          }
        } else if (csvType === CsvType.ABN_AMRO) {
          let amount: number = Number.parseFloat(line[6].replace(',', '.'));
          transaction.amount = Math.abs(amount);
          if (amount < 0) {
            transaction.costType = CostType.GENERAL_EXPENSE;
          } else {
            transaction.costType = CostType.GENERAL_INCOME;
          }
          description = line[7];
        } else if (csvType === CsvType.OV_CHIPKAART) {
          transaction.accountNumber = 'Chipkaart';
          transaction.amount = Number.parseFloat(line[5].replace(',', '.'));
          description = 'Van ' + line[2] + ' naar ' + line[4] + ' (' + line[3] + ') ' + line[6] + ' ' + line[7] + ' ' + line[8];
        }
        transaction.description = description;

        transaction.costCharacter = CostCharacter.UNKNOWN;
        transaction.costTypeDescription = this.labelService.get(CostType[transaction.costType]);
        transaction.costCharacterDescription = this.labelService.get(CostCharacter[transaction.costCharacter]);
        this.transactions.push(transaction);
      }
    });
    return this.transactions;
  }
}
