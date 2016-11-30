import angular from 'angular';

export class LibraryService {
  get dateFormatter() {
    return this._dateFormatter;
  }

  set dateFormatter(dateFormatter) {
    this._dateFormatter = dateFormatter;
  }

  constructor($http, $q, rx, $filter) {
    'ngInject';
    this.$http = $http;
    this.$q = $q;
    this.Rx = rx;
    this.$filter = $filter;

    this.context = '/books';
    this._dateFormatter = $filter('date');

    this.books = [];
  }

  retrieveBooks({searchTerm='', sortBy=''}={}) {
    let config = { params: {} };
    if (searchTerm) {
      config.params.search = searchTerm;
    }
    if (sortBy) {
      config.params.sortBy = sortBy;
    }

    return this.$http.get(this.context, config)
      .then((resp) => {
        return resp.data.map((rawBook) => {
          let {title, author, pubDate} = rawBook;
          return {
            title,
            author,
            pubDate: new Date(pubDate)
          };
        });
      })
      .then((books) => {
        this.books = books; 
        return this.books.map(book => {
          return Object.assign({}, book, {
            pubDate: new Date(book.pubDate.getTime())
          });
        });
      })
      .then(books => {
        // simulate back-end sorting
        return sortBy? this.$filter('orderBy')(books, sortBy) : books;
      });
  }

  findBooks(searchTerm) {
    return this.retrieveBooks({searchTerm})
      .then((books) => {
        // simulate back-end filtering of results
        return searchTerm? this.filterBooks(searchTerm, books) : books;
      });
  }

  filterBooks(searchTerm, books) {
    books = books.map(book => {
      return Object.assign(book, {
        pubDate: this.dateFormatter(book.pubDate)
      });
    });
    return this.$filter('filter')(books, searchTerm);
  }

  addBook(book) {
    let deferred = this.$q.defer();

    if (this.validateBook(book)) {
      let data = this.serializeBook(book);
      this.$http.put(this.context, data).then(() => {
        deferred.resolve();
      });
    } else {
      deferred.reject('Trying to add an invalid book');
    }

    return deferred.promise;
  }

  validateBook(book) {
    let { title, author, pubDate } = book;
    if (
      angular.isString(title) && title.trim() != '' &&
      angular.isString(author) && author.trim() != '' &&
      angular.isDate(pubDate)) 
    {
      return true;
    } else {
      return false;
    }
  }

  serializeBook(book) {
    let { title, author, pubDate } = book;
    return {
      title,
      author,
      pubDate: [pubDate.getFullYear(), pubDate.getMonth() + 1, pubDate.getDate()]
    };
  }

}