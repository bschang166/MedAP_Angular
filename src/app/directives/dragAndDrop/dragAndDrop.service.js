import angular from 'angular';

export class DragAndDropService {

  constructor($rootScope, $timeout, $document, $window) {
    'ngInject';
    this.$document = $document;
    this.$window = $window;
    this.$rootScope = $rootScope;
  }

  reset() {
    this.dragModel = null;
    this.dragTarget = null;
    this.initialIndex = null;
    this.placeholderElm = null;
  }

  handleDrop(event, dropContainer, onDrop) {
    dropContainer = angular.element(dropContainer);
    
    let dragData = {
      model: this.dragModel,
      dragIndex: this.initialIndex,
      dropIndex: this.domIndexOf(this.dragTarget)
    };

    onDrop(dragData);
  }

  startDrag(dragModel, dragTargetElm) {
    this.reset();

    this.dragModel = dragModel;
    this.initialIndex = this.domIndexOf(dragTargetElm);

    this.dragTarget = angular.element(dragTargetElm);
    this.dragTarget.addClass('draggable-active');

    this.placeholderElm = this.$window.document.createComment('');
    this.dragTarget.after(this.placeholderElm);
  }

  endDrag() {
    this.$rootScope.$applyAsync(() => {
      this.dragTarget.removeClass('draggable-active');
      this.placeholderElm.replaceWith(this.dragTarget[0]);
      this.reset();
    })
  }

  moveDragTarget(event, dropContainer, dragoverIndex) {
    dropContainer = angular.element(dropContainer);
    let dragoverChild = angular.element(dropContainer.children()[dragoverIndex]);
    if ((dragoverChild[0] && this.dragTarget[0] === dragoverChild[0])) {
      return;
    }

    event.dataTransfer.dropEffect = 'move';

    if (this.isDropWithinElmContainer(event, dropContainer)) {
      if (!dragoverChild[0]) {
        dropContainer.append(this.dragTarget);
        return;
      } 
      // else check if pointer is above/below dragoverChildElm vertical midline
      let point = this.getDropPoint(event);
      let elmPos = this.offset(dragoverChild);
      let vertMidline = elmPos.top + (elmPos.height / 2);
      if (point.y < vertMidline) {
        dropContainer[0].insertBefore(this.dragTarget[0], dragoverChild[0]);
      } else {
        dragoverChild.after(this.dragTarget);
      }
    }
  }

  domIndexOf(element) {
    let parent = angular.element(element.parent());
    return Array.prototype.indexOf.call(parent.children(), element[0]);
  }

  isDropWithinElmContainer(event, elm) {
    elm = angular.element(elm);

    let elmPos = this.offset(elm);
    let point = this.getDropPoint(event);
    // check if point is within drop container
    if ( elmPos.left < point.x < elmPos.left + elmPos.width &&
      elmPos.top < point.y < elmPos.top + elmPos.height ) {
      return true;
    } else {
      return false;
    }
  }

  getDropPoint(event) {
    return {
      x: event.pageX,
      y: event.pageY
    };
  } 

  // Source: https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
  offset($element) {
    let elem = $element[0] || $element;

    var elemBCR = elem.getBoundingClientRect();
    return {
        width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
        height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
        top: Math.round(elemBCR.top + (this.$window.pageYOffset || this.$document[0].documentElement.scrollTop)),
        left: Math.round(elemBCR.left + (this.$window.pageXOffset || this.$document[0].documentElement.scrollLeft))
    };
  }

}