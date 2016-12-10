'use strict';

import { LibraryModule } from '../library.module';

describe('AddBookForm component', () => {

  beforeEach(angular.mock.module(LibraryModule));

  let LibraryService;
// ---------- Unit Tests -------------------------------------------------------
  describe('unit tests', () => {
    let scope;
    let element;
    let ctrl;

    let $timeout;
    beforeEach(inject(($rootScope, $compile, _$timeout_) => {
      $timeout = _$timeout_;

      scope = $rootScope.$new();
      scope.onSubmit = jasmine.createSpy('onSubmit');
      element = $compile('<add-book-form on-submit="onSubmit($event)"></add-book-form>')(scope);
      ctrl = element.controller('add-book-form');
      scope.$apply();
    }));

    it('should call not onSubmit when form is empty', () => {
      submit();
      expect(scope.onSubmit).not.toHaveBeenCalled();
    });

    describe('form entry', () => {
      let titleInput;
      let authorInput;
      let pubDateInput;
      beforeEach(() => {
        titleInput = angular.element(element[0].querySelector('input[name="title"]'));
        authorInput = angular.element(element[0].querySelector('input[name="author"]'));
        pubDateInput = angular.element(element[0].querySelector('input[name="pubDate"]'));

        titleInput.val('testTitle');
        triggerChange(titleInput);

        authorInput.val('testAuthor');
        triggerChange(authorInput);

        pubDateInput.val('2016-10-12');
        triggerChange(pubDateInput);
      });

      it('should call onSubmit when form is valid', () => {
        submit();
        expect(scope.onSubmit).toHaveBeenCalled();
      });

      it('should not call onSubmit when title is empty', () => {
        titleInput.val('');
        triggerChange(titleInput);
        submit();
        expect(scope.onSubmit).not.toHaveBeenCalled();
      });

      it('should not call onSubmit when author is empty', () => {
        authorInput.val('');
        triggerChange(authorInput);
        submit();
        expect(scope.onSubmit).not.toHaveBeenCalled();
      });

      it('should not call onSubmit when pubDate is empty', () => {
        pubDateInput.val('');
        triggerChange(pubDateInput);
        submit();
        expect(scope.onSubmit).not.toHaveBeenCalled();
      });

      it('should not call onSubmit when pubDate is invalid format', () => {
        pubDateInput.val('11/22/2016');
        triggerChange(pubDateInput);
        submit();
        expect(scope.onSubmit).not.toHaveBeenCalled();
      });

      it('should reset form after valid submission', () => {
        submit();
        $timeout.flush();
        expect(ctrl.bookToAdd).toEqual({});
        expect(ctrl.$scope.addBookForm.$submitted).toEqual(false);
        expect(ctrl.$scope.addBookForm.$pristine).toEqual(true);
        expect(ctrl.$scope.addBookForm.$dirty).toEqual(false);
      });

      function triggerChange(inputElm) {
        inputElm.triggerHandler('change');
        inputElm.triggerHandler('blur');
      }
    });

    function submit() {
      element.find('button').triggerHandler('click');
    }

  });

});