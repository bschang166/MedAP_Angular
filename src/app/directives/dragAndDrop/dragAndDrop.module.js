import angular from 'angular';

import { DragAndDropService } from './dragAndDrop.service';
import { Draggable } from './draggable.directive';
import { Droppable } from './droppable.directive';

export const DragAndDropModule = angular
  .module('app.directives.dragAndDrop', [
  ])
  .service('DragAndDropService', DragAndDropService)
  .directive('medDraggableModel', Draggable.create)
  .directive('medOnDrop', Droppable.create)
  .name;