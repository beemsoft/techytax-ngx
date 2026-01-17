import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { CostService } from '@app/shared/services/cost.service';

@Component({
  standalone: false,templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  costs = signal<any[] | null>(null);

  constructor(
    private costService: CostService
  ) {
  }

  ngOnInit() {
    this.costService.getCosts()
      .pipe(first())
      .subscribe(costs => {
        this.costs.set(costs as unknown as any[]);
      });
  }

  deleteCost(id: string) {
    const cost = this.costs().find(x => x.id === id);
    cost.isDeleting = true;
    this.costService.deleteCost(id)
      .pipe(first())
      .subscribe(() => {
        this.costs.set(this.costs().filter(x => x.id !== id));
      });
  }
}
