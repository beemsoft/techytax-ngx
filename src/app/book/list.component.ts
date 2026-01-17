import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BookService } from '@app/shared/services/book.service';

@Component({
  standalone: false,templateUrl: 'list.component.html'})
export class ListComponent implements OnInit {
  bookValues = null;

  constructor(private bookService: BookService) {
  }

  ngOnInit() {
    this.bookService.getBookValues()
      .pipe(first())
      .subscribe(bookValues => this.bookValues = bookValues);
  }

  deleteBookValue(id: number) {
    const bookValue = this.bookValues.find(x => x.id === id);
    bookValue.isDeleting = true;
    this.bookService.deleteBookValue(bookValue.id)
      .pipe(first())
      .subscribe(() => {
        this.bookValues = this.bookValues.filter(x => x.id !== id)
      });
  }
}
