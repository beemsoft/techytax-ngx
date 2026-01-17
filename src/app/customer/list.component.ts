import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { CustomerService } from '@app/shared/services/customer.service';

@Component({
  standalone: false, templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    customers = signal<any[] | null>(null);

    constructor(
        private customerService: CustomerService
    ) {}

    ngOnInit() {
        this.customerService.getCustomers()
            .pipe(first())
            .subscribe(customers => {
                this.customers.set(customers);
            });
    }

    deleteCustomer(id: string) {
        const customer = this.customers().find(x => x.id === id);
        customer.isDeleting = true;
        this.customerService.deleteCustomer(id)
            .pipe(first())
            .subscribe(() => {
                this.customers.set(this.customers().filter(x => x.id !== id));
            });
    }
}
