import { Component, OnInit, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivumService } from '@app/shared/services/activum.service';

@Component({
  standalone: false,templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  activa = signal<any[] | null>(null);

  constructor(
    private activumService: ActivumService
  ) {
  }

  ngOnInit() {
    this.activumService.getActiva()
      .pipe(first())
      .subscribe(activa => {
        this.activa.set(activa as unknown as any[]);
      });
  }

  deleteActivum(id: string) {
    const activum = this.activa().find(x => x.id === id);
    activum.isDeleting = true;
    this.activumService.deleteActivum(id)
      .pipe(first())
      .subscribe(() => {
        this.activa.set(this.activa().filter(x => x.id !== id));
      });
  }
}
