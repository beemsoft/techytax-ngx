import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CustomerService } from '@app/shared/services/customer.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    customers = null;

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomers()
            .pipe(first())
            .subscribe(customers => this.customers = customers);
    }

    deleteCustomer(id: string) {
        const customer = this.customers.find(x => x.id === id);
        customer.isDeleting = true;
        this.customerService.deleteCustomer(id)
            .pipe(first())
            .subscribe(() => {
                this.customers = this.customers.filter(x => x.id !== id)
            });
    }
}
