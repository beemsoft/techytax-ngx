import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { CostService } from '@app/shared/services/cost.service';

@Component({templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  costs = null;

  constructor(private costService: CostService) {
  }

  ngOnInit() {
    this.costService.getCosts()
      .pipe(first())
      .subscribe(costs => this.costs = costs);
  }

  deleteCost(id: string) {
    const cost = this.costs.find(x => x.id === id);
    cost.isDeleting = true;
    this.costService.deleteCost(id)
      .pipe(first())
      .subscribe(() => {
        this.costs = this.costs.filter(x => x.id !== id)
      });
  }
}
