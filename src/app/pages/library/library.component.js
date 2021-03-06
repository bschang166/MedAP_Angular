import angular from 'angular';
import template from './library.html';
import './library.css';

class LibraryController {
  get dateFormatter() {
    return this._service.dateFormatter;
  }

  constructor($scope, LibraryService, $filter, $timeout) {
    'ngInject';
    this.$scope = $scope;
    this._service = LibraryService;
    this.$filter = $filter;
    this.$timeout = $timeout;

    let formatter = $filter('date');
    this._service.dateFormatter = function(date) {
      return formatter(date, 'mediumDate');
    }

    this.bookSortAttrs = [
      { label: 'Title', name: 'title' },
      { label: 'Author', name: 'author' },
      { label: 'Published Date', name: 'pubDate' },
    ];

    this.isUppercaseTitle = false;
  }

  $onInit() {
    this.sortBy = this.bookSortAttrs[0].name;
    this.searchResults = [];

    this.loadBooks();
  }

  loadBooks() {
    let opts = this.sortBy? {sortBy: this.sortBy} : {};
    return this._service.retrieveBooks(opts)
      .then(books => {
        books = books.map((book) => {
          book.pubDate = this.dateFormatter(book.pubDate);
          return book;
        });

        this.filteredBooks = this.filterBooks(books);
      });
  }

  filterBooks(books) {
    return books.map((book) => {
      book.title = this.isUppercaseTitle? this.$filter('uppercase')(book.title) : this.$filter('capitalize')(book.title);
      return book;
    });
  }

  onToggleUppercase(shouldUppercase) {
    this.isUppercaseTitle = shouldUppercase;
    this.filteredBooks = this.filterBooks(this.filteredBooks);
  }

  onBookSearch(event) {
    if (event.term === '') {
      this.searchResults = [];
      return;
    }

    this._service.findBooks(event.term)
      .then(books => {
        this.searchResults = books.map(book => {
          return `${book.title} - ${book.author} - ${this.dateFormatter(book.pubDate)}`;
        });
      });
  }

  addBook(event) {
    let book = event.book;
    this._service.addBook(book).then(() => {
      this.loadBooks();
    });
  }

  onBookSort() {
    this.loadBooks();
  }

  onDropBook(event) {
    this.sortBy = '';
  }

}

export const LibraryComponent = {
  template: template,
  controller: LibraryController,
  bindings: {}
};