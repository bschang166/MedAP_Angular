import angular from 'angular';
import uiRouter from 'angular-ui-router';
import rx from 'rx-angular';

import { CommonModule } from './common/app.common.module';
import { DirectivesModule } from './directives/app.directives.module';
import { FiltersModule } from './filters/app.filters.module';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';

import mockBackend from './mockBackend';
import ngMock from 'angular-mocks';

const MODULES = [
  'ngMockE2E',

  'rx',
  uiRouter,

  CommonModule,
  DirectivesModule,
  FiltersModule,
  PagesModule,
];

export const AppModule = angular
  .module('app', [
    ...MODULES,
  ])
  .run(mockBackend)
  .run(($rootScope, $timeout) => {
    $timeout(() => {
      $rootScope.$pageFinishedLoading = true;
    });
  })
  .component('medApp', AppComponent)
  .name;