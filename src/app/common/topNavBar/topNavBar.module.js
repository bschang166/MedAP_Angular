import angular from 'angular';
import uiRouter from 'angular-ui-router';

import { TopNavBarComponent } from './topNavBar.component';

export const TopNavBarModule = angular
  .module('app.common.topNavBar', [
    uiRouter,
  ])
  .component('topNavBar', TopNavBarComponent)
  .name;