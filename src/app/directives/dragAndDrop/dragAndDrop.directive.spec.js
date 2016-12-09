'use strict';

import { DragAndDropModule } from './dragAndDrop.module';

describe('DragAndDrop directive', () => {

  beforeEach(angular.mock.module(DragAndDropModule));

// ---------- Unit Tests -------------------------------------------------------
  describe('unit tests', () => {
    let $timeout;

    let scope;
    let element;

    let dragAndDropService;
    beforeEach(inject(($rootScope, $compile, _$timeout_, _DragAndDropService_) => {
      $timeout = _$timeout_;
      dragAndDropService = _DragAndDropService_;

      scope = $rootScope.$new();
      scope.items = [
        { name: '1' },
        { name: '2' },
        { name: '3' },
      ];
      element = $compile(`
        <ul med-dnd-model="items" med-dnd-type="dndType" med-dnd-on-drop="onDrop($event)">
          <li ng-repeat="item in items">
            <div> {{item.name}} </div>
          </li>
        </ul>
      `)(scope);

      scope.$digest();
    }));

    it('should add draggable attribute to only direct children', () => {
      Array.prototype.forEach.call(element.find('li'), (item) => {
        expect(item.getAttribute('draggable')).toBe('true');
        expect(item.firstElementChild.getAttribute('draggable')).toBeNull();
      });
    });

    it('should watch dnd-model by reference', () => {
      let length = scope.items.length;
      expect(element.find('li').length).toEqual(length);
      scope.items.splice(0, 1);
      expect(element.find('li').length).toEqual(length);
      scope.items = [];
      scope.$digest();
      expect(element.find('li').length).toEqual(scope.items.length);
    });

    // describe('drag and drop', () => {
    //   let testBooks;
    //   let target = newBook('title', 'author', 'date');
    //   beforeEach(() => {
    //     testBooks = [newBook(), newBook(), newBook()];
    //   });

    //   it('should move book from top to bottom', () => {
    //     let books = [
    //       target,
    //       ...testBooks,
    //     ];
    //     ctrl.filteredBooks = books;

    //     ctrl.onDropBook({}, {model: books, dragIndex: 0,dropIndex: books.length - 1});

    //     let expected = [
    //       ...testBooks,
    //       target,
    //     ];

    //     expect(ctrl.filteredBooks).toEqual(expected);
    //   });

    //   it('should move book from bottom to top', () => {
    //     let books = [
    //       ...testBooks,
    //       target,
    //     ];
    //     ctrl.filteredBooks = books;

    //     ctrl.onDropBook({}, {model: books, dragIndex: books.length - 1, dropIndex: 0});

    //     let expected = [
    //       target,
    //       ...testBooks,
    //     ];
    //     expect(ctrl.filteredBooks).toEqual(expected);
    //   });


    //   it('should move book from middle to top', () => {
    //     let books = [
    //       ...testBooks,
    //       target,
    //       ...testBooks,
    //     ];
    //     ctrl.filteredBooks = books;

    //     ctrl.onDropBook({}, {model: books, dragIndex: testBooks.length, dropIndex: 0});

    //     let expected = [
    //       target,
    //       ...testBooks,
    //       ...testBooks,
    //     ];
    //     expect(ctrl.filteredBooks).toEqual(expected);
    //   });

    //   it('should move book from middle to bottom', () => {
    //     let books = [
    //       ...testBooks,
    //       target,
    //       ...testBooks,
    //     ];
    //     ctrl.filteredBooks = books;

    //     ctrl.onDropBook({}, {model: books, dragIndex: testBooks.length, dropIndex: books.length - 1});

    //     let expected = [
    //       ...testBooks,
    //       ...testBooks,
    //       target,
    //     ];
    //     expect(ctrl.filteredBooks).toEqual(expected);
    //   });

    // });

  });

});