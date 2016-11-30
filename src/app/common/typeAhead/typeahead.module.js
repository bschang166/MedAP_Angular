import angular from 'angular';
import rx from 'rx-angular';

import { TypeaheadComponent } from './typeahead.component';

export const TypeaheadModule = angular
  .module('app.common.typeahead', [
    'rx',
  ])
  .component('typeahead', TypeaheadComponent)
  .name;