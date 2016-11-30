import angular from 'angular';

import { DragAndDropModule } from './dragAndDrop/dragAndDrop.module';

export const DirectivesModule = angular
  .module('app.directives', [
    DragAndDropModule
  ])
  .name;