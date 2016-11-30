import angular from 'angular';
import uiRouter from 'angular-ui-router';
import rx from 'rx-angular';

import { FiltersModule } from '../../filters/app.filters.module';

import { LibraryService } from './library.service';
import { LibraryComponent } from './library.component';

export const LibraryModule = angular
  .module('app.pages.library', [
    'rx',
    uiRouter,

    FiltersModule,
  ])
  .service('LibraryService', LibraryService)
  .component('library', LibraryComponent)
  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';
    $stateProvider
      .state('library', {
        url: '/library',
        component: 'library',
        title: 'Library',
      });

    $urlRouterProvider.otherwise('/');
  })
  .name
  ;