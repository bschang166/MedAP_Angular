import angular from 'angular';
import template from './typeahead.html';

import './typeahead.css';

class TypeaheadController {
  constructor($scope, rx) {
    'ngInject';
    this.$scope = $scope;
    this.Rx = rx;
  }

  $onChanges(changes) {
    if (changes.debounceTime) {
      this.debounceTime = changes.debounceTime.currentValue != null? parseInt(changes.debounceTime.currentValue, 10) : 300;

      if (!changes.debounceTime.isFirstChange()) {
        this._resetSearchTerms();
      }
    }
  }

  $onInit() {
    this.searchTerm = '';
    this.showRecords = false;
    this._resetSearchTerms();
  }

  _resetSearchTerms() {
    this._searchTerms = new this.Rx.Subject();

    let {debounceTime} = this;
    this._onSearchTerms = this._searchTerms
      .debounce(debounceTime)
      .distinctUntilChanged()
      .map((term) => {
        return term;
      })
      .subscribe((term) => {
        this.onChange({
          $event: {
            term: this.searchTerm
          }
        });
      });
  }

  search(term) {
    this._searchTerms.onNext(term);
  }

  onFocus() {
    this.showRecords = true;
    this._searchTerms.onNext(this.searchTerm);
  }

  onBlur() {
    this.showRecords = false;
  }

  $onDestroy() {
    if (this._onSearchTerms) {
      this._onSearchTerms.dispose();
    }
  }

}

export const TypeaheadComponent = {
  template: template,
  controller: TypeaheadController,
  bindings: {
    displayRecords: '<',
    onChange: '&',

    debounceTime: '<changeInterval',
  }
};