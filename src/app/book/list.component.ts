import { Component, OnInit, signal } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { BookService, BookType } from '@app/shared/services/book.service';
import { LabelService } from '@app/shared/services/label.service';

@Component({
  standalone: false,templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  bookValues = signal<any[] | null>(null);

  constructor(
    private bookService: BookService,
    private labelService: LabelService
  ) {
  }

  ngOnInit() {
    this.bookService.getBookValues()
      .pipe(
        first(),
        map(bookValues => bookValues.map(bv => {
          const enumKey = typeof bv.balanceType === 'number' ? BookType[bv.balanceType] : bv.balanceType;
          const description = this.labelService.get(enumKey) || enumKey || '';
          return {
            ...bv,
            balanceTypeDescription: description
          };
        }))
      )
      .subscribe(bookValues => {
        this.bookValues.set(bookValues);
      });
  }

  deleteBookValue(id: number) {
    const bookValue = this.bookValues().find(x => x.id === id);
    bookValue.isDeleting = true;
    this.bookService.deleteBookValue(bookValue.id)
      .pipe(first())
      .subscribe(() => {
        this.bookValues.set(this.bookValues().filter(x => x.id !== id));
      });
  }
}
