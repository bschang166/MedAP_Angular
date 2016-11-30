import angular from 'angular';
import template from './app.html';

import './app.css';

class AppController {
  constructor() {
    'ngInject';
  }

  $onInit() {
  }
}

export const AppComponent = {
  template: template,
  controller: AppController,
  bindings: {}
};