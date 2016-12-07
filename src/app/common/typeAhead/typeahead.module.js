import angular from 'angular';

import { TypeaheadComponent } from './typeahead.component';

export const TypeaheadModule = angular
  .module('app.common.typeahead', [
  ])
  .component('typeahead', TypeaheadComponent)
  .name;