'use strict';

import { LibraryModule } from './library.module';

describe('Library component', () => {

  let addBookFormSpy = componentSpyOn('addBookForm');
  beforeEach(angular.mock.module(LibraryModule, addBookFormSpy));

  function componentSpyOn(name) {
    function componentSpy($provide) {
      componentSpy.bindings = [];
   
      $provide.decorator(name + 'Directive', ($delegate) => {
        let component = $delegate[0];
   
        component.template = '';
        component.controller = class {
          constructor() {
            componentSpy.bindings.push(this);
          }
        };
   
        return $delegate;
      });
    }

    return componentSpy;
  }

  let LibraryService;
// ---------- Unit Tests -------------------------------------------------------
  describe('unit tests', () => {
    let scope;
    let element;
    let ctrl;
    let deferred;

    let $q;
    beforeEach(inject(($rootScope, _$q_, $compile, _LibraryService_, _$componentController_) => {
      $q = _$q_;

      LibraryService = _LibraryService_;
      deferred = _$q_.defer();
      spyOn(LibraryService, 'retrieveBooks').and.returnValue(deferred.promise);

      scope = $rootScope.$new();
      element = $compile('<library></library>')(scope);
      ctrl = element.controller('library');
      scope.$apply();
    }));

    it('should call service to add then load book', () => {
      LibraryService.retrieveBooks.calls.reset();
      let addBookDeferred = $q.defer();
      spyOn(LibraryService, 'addBook').and.returnValue(addBookDeferred.promise);
      addBookDeferred.resolve();

      let book = newBook('title', 'author', new Date(2016, 11, 12));
      addBookFormSpy.bindings[0].onSubmit({$event: {book}});
      scope.$apply();

      expect(LibraryService.addBook).toHaveBeenCalledWith(book);
      expect(LibraryService.retrieveBooks.calls.count()).toEqual(1);
    });

  });


// ---------- Shallow Unit Tests ------------------------------------------------
  describe('shallow tests', () => {
    let $componentController;
    let scope;
    let element;
    let ctrl;

    let deferred;

    beforeEach(inject(($rootScope, _$componentController_, _$q_, $compile) => {
      deferred = _$q_.defer();

      LibraryService = {
        retrieveBooks: function(){},
      }

      scope = $rootScope.$new();
      $componentController = _$componentController_;

      ctrl = $componentController('library', {
        $scope: scope,
        LibraryService: LibraryService
      }, {});

    }));

    describe('on init', () => {
      it('should retrieve books with default book sort attr', () => {
        spyOn(LibraryService, 'retrieveBooks').and.returnValue(deferred.promise);
        ctrl.bookSortAttrs = [{name: 'defaultSortBy'}];

        ctrl.$onInit();

        expect(LibraryService.retrieveBooks).toHaveBeenCalledWith({sortBy: 'defaultSortBy'});
      });

      it('should load books with set date formatter on service', () => {
        spyOn(LibraryService, 'retrieveBooks').and.returnValue(deferred.promise);
        spyOn(LibraryService, 'dateFormatter').and.returnValue('testDate');
        let books = [newBook()];
        deferred.resolve(books);

        ctrl.$onInit();
        scope.$digest();

        expect(ctrl.filteredBooks[0].pubDate).toEqual('testDate');
      });

      it('should load books with title transformed', () => {
        spyOn(LibraryService, 'retrieveBooks').and.returnValue(deferred.promise);
        let books = [newBook('title')];
        deferred.resolve(books);

        ctrl.isUppercaseTitle = true;
        ctrl.$onInit();
        scope.$digest();

        expect(ctrl.filteredBooks[0].title).toEqual('TITLE');

        ctrl.isUppercaseTitle = false;
        ctrl.$onInit();
        scope.$digest();

        expect(ctrl.filteredBooks[0].title).toEqual('Title');
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