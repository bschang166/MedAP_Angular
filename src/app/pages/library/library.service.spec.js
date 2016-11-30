'use strict';

import { LibraryModule } from './library.module';

describe('Library service', () => {

  beforeEach(angular.mock.module(LibraryModule));

  let LibraryService;
  let $q;
  let $http;

  let deferred;
  describe('unit tests', () => {
    beforeEach(inject((_LibraryService_, _$q_, _$http_) => {
      LibraryService = _LibraryService_;
      $q = _$q_;
      $http = _$http_;

      deferred = $q.defer();
    }));

    describe('GET books', () => {
      it('should get books', () => {
        spyOn($http, 'get').and.returnValue(deferred.promise);

        LibraryService.context = '/testUrl';
        LibraryService.retrieveBooks();

        expect($http.get).toHaveBeenCalledWith('/testUrl', {params: {}});
      });

      it('should get books with params', () => {
        spyOn($http, 'get').and.returnValue(deferred.promise);
        let params = {
          searchTerm: 'testTerm',
          sortBy: 'testSortBy'
        };

        LibraryService.context = '/testUrl';
        LibraryService.retrieveBooks(params);

        expect($http.get).toHaveBeenCalledWith('/testUrl', {params: {search: 'testTerm', sortBy: 'testSortBy'}});
      });
      
    });


    describe('PUT book', () => {
      it('should put book if book is valid', () => {
        spyOn($http, 'put').and.returnValue(deferred.promise);
        let book = newBook('title', 'author', new Date(2016, 11, 3));

        LibraryService.context = '/testUrl';
        LibraryService.addBook(book);

        let expectedBookData = {
          title: 'title',
          author: 'author',
          pubDate: [2016, 12, 3]
        }
        expect($http.put).toHaveBeenCalledWith('/testUrl', expectedBookData);
      });

      it('should not put book if book has empty fields', () => {
        spyOn($http, 'put').and.returnValue(deferred.promise);
        let book = newBook('     ', '     ');

        LibraryService.context = '/testUrl';
        LibraryService.addBook(book);

        expect($http.put).not.toHaveBeenCalled();
      });
    });
  });

  function newBook(title='', author='', pubDate=new Date()) {
    return {
      title,
      author,
      pubDate
    };
  }

});