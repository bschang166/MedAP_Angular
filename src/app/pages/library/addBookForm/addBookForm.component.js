import angular from 'angular';
import template from './addBookForm.html';
import './addBookForm.css';

class AddBookFormController {
  constructor($scope, $filter, $timeout) {
    'ngInject';
    this.$scope = $scope;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.bookToAdd = {};
  }

  $onChanges(changes) {
  }

  addBook(book) {
    this.onSubmit({
      $event: {
        book  
      }
    });

    this.$timeout(() => {
      // reset form
      this.bookToAdd = {};
      this.$scope.addBookForm.$setPristine();
      this.$scope.addBookForm.$setUntouched();
    });
  }
}

export const AddBookFormComponent = {
  template: template,
  controller: AddBookFormController,
  bindings: {
    onSubmit: '&',
  }
};