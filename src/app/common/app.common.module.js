import angular from 'angular';

import { TopNavBarModule } from './topNavBar/topNavBar.module';
import { TypeaheadModule } from './typeahead/typeahead.module';

export const CommonModule = angular
  .module('app.common', [
    TopNavBarModule,

    TypeaheadModule,
  ])
  .name;