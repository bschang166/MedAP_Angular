'use strict';

import { TypeaheadModule } from './typeahead.module';

describe('Typeahead component', () => {

  beforeEach(angular.mock.module(TypeaheadModule));

// ---------- Unit Tests -------------------------------------------------------
  describe('unit tests', () => {
    let $timeout;

    let scope;
    let element;
    let ctrl;

    let debounce = 300;
    let input;
    beforeEach(inject(($rootScope, $compile, _$timeout_) => {
      $timeout = _$timeout_;

      scope = $rootScope.$new();
      scope.onChange = jasmine.createSpy('onChange');
      element = $compile('<typeahead display-records="displayRecords" on-change="onChange($event)"></typeahead>')(scope);
      ctrl = element.controller('typeahead');

      input = element.find('input');
      scope.$digest();
    }));

    it('should call onChange when input changes', () => {
      input.val('test me').triggerHandler('change');
      $timeout.flush(debounce);
      expect(scope.onChange).toHaveBeenCalledWith({term: 'test me'});
    });

    it('should only call onChange until input changes to a distinct value', () => {
      input.val('test me').triggerHandler('change');
      $timeout.flush(debounce);
      expect(scope.onChange.calls.count()).toEqual(1);

      input.val('test me').triggerHandler('change');
      $timeout.flush(debounce);
      expect(scope.onChange.calls.count()).toEqual(1);

      input.val('test me again').triggerHandler('change');
      $timeout.flush(debounce);
      expect(scope.onChange.calls.count()).toEqual(2);
    });

    it('should call onChange with search term on input focus', () => {
      ctrl.searchTerm = 'test search term';
      input.triggerHandler('focus');
      expect(scope.onChange).toHaveBeenCalledWith({term: 'test search term'});
    });

    it('should debounce input change events', () => {
      input.val('test me').triggerHandler('change');
      $timeout.flush(debounce-1);
      expect(scope.onChange).not.toHaveBeenCalled();
      input.val('test me again').triggerHandler('change');
      $timeout.flush(debounce);
      expect(scope.onChange).toHaveBeenCalled();
    });

    it('should not display records until input focus', () => {
      scope.displayRecords = ['1', '2'];
      scope.$digest();
      expect(element.find('li').length).toEqual(0);
    })

    it('should display records in array order on input focus', () => {
      scope.displayRecords = ['test item 1', 'test item 2'];
      input.triggerHandler('focus');
      let items = element.find('li');
      expect(items.eq(0).text()).toContain('test item 1');
      expect(items.eq(1).text()).toContain('test item 2');
    });

    it('should not display records on input blur', () => {
      scope.displayRecords = ['test item 1', 'test item 2'];
      input.triggerHandler('focus');
      input.triggerHandler('blur');
      expect(element.find('li').length).toEqual(0);
    });

    it('should display "Empty list" if no display records are given', () => {
      scope.displayRecords = [];
      input.triggerHandler('focus');
      let items = element.find('li');
      expect(items.length).toEqual(1);
      expect(items.eq(0).text()).toContain('Empty list');
    });

  });

});