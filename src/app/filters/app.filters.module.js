import angular from 'angular';

import capitalizeFilter from './capitalize.filter';

export const FiltersModule = angular
  .module('app.filters', [
  ])
  .filter('capitalize', capitalizeFilter)
  .name;