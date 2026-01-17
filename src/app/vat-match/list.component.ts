import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { CostMatchService } from '@app/shared/services/cost-match.service';
import { CostType } from '@app/shared/services/import-list.service';

@Component({
  standalone: false,templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  costMatches = signal<any[] | null>(null);
  costTypes = CostType;

  constructor(
    private costMatchService: CostMatchService
  ) {
  }

  ngOnInit() {
    this.costMatchService.getMatches()
      .pipe(first())
      .subscribe(costMatches => {
        this.costMatches.set(costMatches as unknown as any[]);
      });
  }

  deleteMatch(id: number) {
    const costMatch = this.costMatches().find(x => x.id === id);
    costMatch.isDeleting = true;
    this.costMatchService.deleteMatch(costMatch)
      .pipe(first())
      .subscribe(() => {
        this.costMatches.set(this.costMatches().filter(x => x.id !== id));
      });
  }
}
