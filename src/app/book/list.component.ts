import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { BookService } from '@app/shared/services/book.service';

@Component({templateUrl: 'list.component.html'})
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

  }
}
