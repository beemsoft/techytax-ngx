import {Injectable} from "@angular/core";

@Injectable()
export class LabelService {
  labels = {
    NONE: 'Geen',
    LOW: 'Laag',
    HIGH: 'Hoog',

    UNKNOWN: 'Onbekend',
    BUSINESS: 'Zakelijk',
    PRIVATE: 'Prive',
    BOTH: 'Beide',

    GENERAL_EXPENSE: 'Algemene uitgave',
    GENERAL_INCOME: 'Algemene inkomst',
    INVOICE_PAID: 'Betaalde factuur',
    IGNORE: 'Negeren',
    VAT: 'Omzetbelasting',
    BUSINESS_FOOD: 'Eten & drinken',
    BUSINESS_CAR: 'Auto',
    FROM_SAVINGS_ACCOUNT: 'Van spaarrekening',
    TO_SAVINGS_ACCOUNT: 'Naar spaarrekening',
    TO_PRIVATE_ACCOUNT: 'Opname naar prive',
    TRAVEL_WITH_PUBLIC_TRANSPORT: 'Reiskosten',
    FROM_PRIVATE_ACCOUNT: 'Inleg vanuit prive',
    INCOME_TAX: 'Inkomstenbelasting',
    INCOME_TAX_PAID_BACK: 'Inkomstenbelasting terugbetaald',
    ROAD_TAX: 'Wegenbelasting',
    INTEREST: 'Rente',
    OFFICE: 'Bedrijfsruimte',
    OFFICE_DISCOUNT: 'Bedrijfsruimte korting',
    INVESTMENT: 'Investering',

    MACHINERY: 'Machines',
    CAR: 'Auto',
    CURRENT_ASSETS: 'Liquide middelen',
    NON_CURRENT_ASSETS: 'Eigen vermogen',
    PENSION: 'Oudedagsreserve',
    STOCK: 'Voorraad',
    VAT_TO_BE_PAID: 'Schuld omzetbelasting',
    INVOICES_TO_BE_PAID: 'Vordering op clienten',

    QUARTERLY: 'Per kwartaal',
    YEARLY: 'Jaarlijks'
  };

  get(key: string): string {
    return this.labels[key];
  };
}
