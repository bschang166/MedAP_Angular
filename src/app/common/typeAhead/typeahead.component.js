import angular from 'angular';
import template from './typeahead.html';

import './typeahead.css';

class TypeaheadController {
  constructor($scope) {
    'ngInject';
    this.$scope = $scope;
  }

  $onChanges(changes) {
  }

  $onInit() {
    this._prevSearchTerm;
    this.searchTerm = '';
    this.showRecords = false;
  }

  search(searchTerm) {
    if (searchTerm === this._prevSearchTerm) {
      return;
    }

    this._prevSearchTerm = searchTerm;
    this.onChange({
      $event: {
        term: this.searchTerm
      }
    });
  }

  onFocus() {
    this.showRecords = true;
    this.search(this.searchTerm);
  }

  onBlur() {
    this.showRecords = false;
  }

}

export const TypeaheadComponent = {
  template: template,
  controller: TypeaheadController,
  bindings: {
    displayRecords: '<',
    onChange: '&',
  }
};