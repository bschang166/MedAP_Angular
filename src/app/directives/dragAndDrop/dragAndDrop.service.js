import angular from 'angular';

export class DragAndDropService {

  constructor($rootScope, $timeout, $document, $window) {
    'ngInject';
    this.$document = $document;
    this.$timeout = $timeout;
    this.$window = $window;
    this.$rootScope = $rootScope;

    this.DND_TYPES = ['move', 'copy'];
  }

  reset() {
    this.isDragging = false;

    this.dndType = null;
    this.dragModel = null;
    this.dragIndex = null;
    this.dragTarget = null;
    this.placeholderElm = null;
  }

  handleDrop(event, dropContainer, dropModel, cb) {
    if (!this.isDragging || this.dragTarget && this.dragTarget.parentNode !== dropContainer) {
      return;
    }

    let dragIndex = this.dragIndex;
    let dropIndex = this.domIndexOf(this.dragTarget);
    let dragModel = this.dragModel;
    if (this.dndType === 'move') {
      let dragItem = dragModel.splice(dragIndex, 1)[0];
      dropModel.splice(dropIndex, 0, dragItem);
    } else {
      dropModel.splice(dropIndex, 0, angular.copy(dragModel[dragIndex]));
    }

    cb({
      $event: {
        dragIndex,
        dropIndex,
        dragModel,
        dropModel,
      }
    });
  }

  startDrag(event, targetElm, sourceModel, dndType) {
    if (this.DND_TYPES.indexOf(dndType) < 0) {
      throw new Error(`dndType '${dndType}' is not supported!`);
    }

    this.reset();
    
    this.isDragging = true;
    
    this.dndType = dndType;
    this.dragModel = sourceModel;
    this.dragIndex = this.domIndexOf(targetElm);

    let target = angular.element(targetElm);
    if (this.dndType === 'move') {
      // insert placeholder element for if drag target dom position need to be reverted after later move
      this.placeholderElm = this.$window.document.createComment('dnd-placeholder');
      target.after(this.placeholderElm);
      this.dragTarget = target[0];
    } else {
      this.dragTarget = target.clone()[0];
    }

    angular.element(this.dragTarget).addClass('med-dnd-drag-active');

    // for FF, dataTransfer must have data to be draggable
    event.dataTransfer.setData('Text', 'data');
  }

  endDrag() {
    if (!this.isDragging) return;

    this.$rootScope.$applyAsync(() => {
      // dragged element must be moved back to its original dom position to avoid issue with Angular internal (such as ng-repeat)
      if (this.dndType === 'move') {
        angular.element(this.placeholderElm).replaceWith(this.dragTarget);
        angular.element(this.dragTarget).removeClass('med-dnd-drag-active');
      } else {
        angular.element(this.dragTarget).remove();
      }
      this.reset();
    })
  }

  handleDragover(event, dragoverElm) {
    if (!this.isDragging || dragoverElm === this.dragTarget) {
      return;
    }

    if (this.dndType === 'move') {
      event.dataTransfer.dropEffect = 'move';
    } else {
      event.dataTransfer.dropEffect = 'copy'; 
    }

    this.moveDragTarget(event, dragoverElm);
  }

  moveDragTarget(event, dragoverElm) {
    this.moveElmToTarget(event, this.dragTarget, dragoverElm);
  }   

  moveElmToTarget(event, elm, target) {
    // check if pointer is above/below target vertical midline, and move elm accordingly
    let point = this.getDropPoint(event);
    let targetPos = this.offset(target);
    let vertMidline = targetPos.top + (targetPos.height / 2);
    if (point.y < vertMidline) {
      target.parentNode.insertBefore(elm, target);
    } else {
      target.parentNode.insertBefore(elm, target.nextElementSibling);
    }
  }

  getDropPoint(event) {
    return {
      x: event.pageX,
      y: event.pageY
    };
  } 

  domIndexOf(element) {
    element = element[0] || element;
    let parent = angular.element(element.parentNode);
    return Array.prototype.indexOf.call(parent.children(), element);
  }

  // Source: https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
  offset(element) {
    let elem = element[0] || element;

    var elemBCR = elem.getBoundingClientRect();
    return {
        width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
        height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
        top: Math.round(elemBCR.top + (this.$window.pageYOffset || this.$document[0].documentElement.scrollTop)),
        left: Math.round(elemBCR.left + (this.$window.pageXOffset || this.$document[0].documentElement.scrollLeft))
    };
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
}