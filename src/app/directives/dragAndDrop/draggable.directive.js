
import angular from 'angular';

class Draggable {
  constructor($timeout, $parse, DragAndDropService) {
    'ngInject';
    this.restrict = 'A';
    this.scope = {
      draggableModel: '<medDraggableModel'
    };

    this.$timeout = $timeout;
    this.$parse = $parse;
    this.dragAndDropService = DragAndDropService;
  }

  link($scope, $element, $attrs) {
    let model;

    $scope.$watchCollection('draggableModel', (newCollection) => {
      Array.prototype.forEach.call($element.children(), (child) => {
        child = angular.element(child);
        child.attr('draggable', !!newCollection);
      });
      model = newCollection;
    });

    $element.on('dragstart', (event) => {
      let target = angular.element(event.target);
      while (target[0] !== $element[0]) {
        if (target[0].hasAttribute('draggable')) {
          break;
        }
        target = target.parent();
      }
      this.dragAndDropService.startDrag(model, target);
    });

    $element.on('dragend', (event) => {
      this.dragAndDropService.endDrag();
    });

    $scope.$on('$destroy', ()=> {
      $element.off('dragstart');
      $element.off('dragend');
    });
  }

  static create() {
    return new Draggable(...arguments);
  }
}

Draggable.create.$inject = ['$timeout', '$parse', 'DragAndDropService'];

export { Draggable };
