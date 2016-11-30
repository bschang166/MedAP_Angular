'use strict';

import { TypeaheadModule } from './typeahead.module';

describe('Typeahead component', () => {

  beforeEach(angular.mock.module(TypeaheadModule));

// ---------- Unit Tests -------------------------------------------------------
  describe('unit tests', () => {
    let scope;
    let element;
    let ctrl;
    let deferred;

    beforeEach(inject(($rootScope, _$q_, $compile) => {
      deferred = _$q_.defer();

      scope = $rootScope.$new();
      element = $compile('<typeahead></typeahead>')(scope);
      ctrl = element.controller('typeahead');
    }));

  });


// ---------- Shallow Unit Tests ------------------------------------------------
  describe('shallow tests', () => {
    let $componentController;
    let scope;
    let element;
    let ctrl;

    let deferred;

    let onChange = function(){};
    beforeEach(inject(($rootScope, _$componentController_, _$q_, $compile) => {
      deferred = _$q_.defer();

      scope = $rootScope.$new();
      $componentController = _$componentController_;

      ctrl = $componentController('typeahead', {
        $scope: scope,
      }, {
        onChange: onChange,
        debounceTime: 300
      });
    }));

  });

});