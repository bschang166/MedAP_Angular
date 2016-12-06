import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { LibraryModule } from './library/library.module';

export const PagesModule = angular
  .module('app.pages', [
    uiRouter,
    LibraryModule,
  ])
  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject';
    $stateProvider
      .state('pages', {
        template: '<ui-view></ui-view>',
        redirectTo: 'pages.library',
      })
      .state('pages.library', {
        url: '/library',
        component: 'library',
        title: 'Library',
      })

    $urlRouterProvider.otherwise('');
  })
  .name
  ;