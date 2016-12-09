
import angular from 'angular';

class DragAndDropDirective {
  constructor($timeout, $parse, DragAndDropService) {
    'ngInject';
    this.restrict = 'A';
    this.scope = {
      model: '<medDndModel',
      dndType: '@medDndType',
      onDrop: '&medDndOnDrop'
    };

    this.$timeout = $timeout;
    this.$parse = $parse;
    this.dragAndDropService = DragAndDropService;
  }

  link($scope, $element, $attrs) {
    let model;
    $scope.$watch('model', (newValue) => {
      model = newValue;
      Array.prototype.forEach.call($element.children(), (child) => {
        child = angular.element(child);
        child.attr('draggable', !!model);
      });
    });
    
    $element.on('dragstart', (event) => {
      let target = event.target;
      if (target === $element[0]) {
        return;
      }
      while (target.parentNode && target.parentNode !== $element[0]) {
        target = target.parentNode;
      }

      this.dragAndDropService.startDrag(event, target, model, $scope.dndType);
    });

    $element.on('dragover', (event) => {
      event.preventDefault();

      let target = event.target;
      if (target === $element[0]) {
        return;
      }
      while (target.parentNode && target.parentNode !== $element[0]) {
        target = target.parentNode;
      }

      this.dragAndDropService.handleDragover(event, target);
    });

    $element.on('drop', (event) => {
      event.preventDefault();
      this.dragAndDropService.handleDrop(event, $element[0], model, $scope.onDrop);
    });

    $element.on('dragend', (event) => {
      this.dragAndDropService.endDrag();
    });

    $scope.$on('$destroy', ()=> {
      $element.off('dragstart dragover drop dragend');
    });
  }

  static create() {
    return new DragAndDropDirective(...arguments);
  }
}

DragAndDropDirective.create.$inject = ['$timeout', '$parse', 'DragAndDropService'];

export { DragAndDropDirective };
