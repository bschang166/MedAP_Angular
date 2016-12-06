
import angular from 'angular';

class Droppable {
  constructor($document, $window, $timeout, $parse, DragAndDropService) {
    'ngInject';
    this.restrict = 'A';

    this.$document = $document;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$parse = $parse;
    this.dragAndDropService = DragAndDropService;
  }

  link($scope, $element, $attrs, ctrls) {
    let onDrop = $attrs['medOnDrop']? this.$parse($attrs['medOnDrop']) : null;

    let dragoverIndex;
    $element.on('dragenter', (event) => {
      // needed on IE for dragover to fire
      event.preventDefault();

      let target = angular.element(event.target);
      while (target[0] !== $element[0]) {
        let parent = target.parent();
        let isDirectChild = parent[0] === $element[0];
        if (isDirectChild) {
          break;
        }
        target = parent;
      }

      dragoverIndex = target[0] === $element[0]? 0 : Array.prototype.indexOf.call($element.children(), target[0]);
    });
    
    $element.on('dragover', (event) => {
      event.preventDefault();

      this.dragAndDropService.moveDragTarget(event, $element, dragoverIndex);
    });

    $element.on('drop', (event) => {
      event.preventDefault();

      if (onDrop) {
        this.dragAndDropService.handleDrop(event, $element, (data) => {
          onDrop($scope, {
            $event: event,
            $data: data
          });
        });
      }
    });

    $scope.$on('$destroy', () => {
      $element.off('dragenter');
      $element.off('dragover');
      $element.off('drop');
    });
  }

  static create() {
    return new Droppable(...arguments);
  }
}

Droppable.create.$inject = ['$document', '$window', '$timeout', '$parse', 'DragAndDropService'];

export { Droppable };