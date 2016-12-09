import angular from 'angular';

import { DragAndDropService } from './dragAndDrop.service';
import { DragAndDropDirective } from './dragAndDrop.directive';

export const DragAndDropModule = angular
  .module('app.directives.dragAndDrop', [
  ])
  .service('DragAndDropService', DragAndDropService)
  .directive('medDndModel', DragAndDropDirective.create)
  .name;