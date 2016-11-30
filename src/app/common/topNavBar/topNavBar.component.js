import angular from 'angular';
import template from './topNavBar.html';

import './topNavBar.css';

class TopNavBarController {
  constructor($state) {
    'ngInject';

    this.$state = $state;
  }

  $onInit() {
    this.links = this.$state.get()
      .filter((state) => {
        return state.title;
      })
      .map((state) => {
        return {
          title: state.title,
          sref: state.name
        };
      });
  }
}

export const TopNavBarComponent = {
  template: template,
  controller: TopNavBarController,
  bindings: {}
};