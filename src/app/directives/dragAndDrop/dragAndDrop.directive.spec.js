'use strict';

import { DragAndDropModule } from './dragAndDrop.module';

describe('DragAndDrop directive', () => {

  beforeEach(angular.mock.module(DragAndDropModule));

// ---------- Unit Tests -------------------------------------------------------
  describe('unit tests', () => {
    let $timeout;

    let scope;
    let element;

    let dragAndDropService;
    beforeEach(inject(($rootScope, $compile, _$timeout_, _DragAndDropService_) => {
      $timeout = _$timeout_;
      dragAndDropService = _DragAndDropService_;

      scope = $rootScope.$new();
      scope.items = [
        { name: '1' },
        { name: '2' },
        { name: '3' },
      ];
      scope.dndType = 'move';
      element = $compile(`
        <ul med-dnd-model="items" med-dnd-type="{{dndType}}" med-dnd-on-drop="onDrop($event)">
          <li ng-repeat="item in items">
            <div> {{item.name}} </div>
          </li>
        </ul>
      `)(scope);

      scope.$apply();
    }));

    it('should add draggable attribute to only direct children', () => {
      Array.prototype.forEach.call(element.find('li'), (item) => {
        expect(item.getAttribute('draggable')).toBe('true');
        expect(item.firstElementChild.getAttribute('draggable')).toBeNull();
      });
    });

    it('should watch dnd-model by reference', () => {
      let length = scope.items.length;
      expect(element.find('li').length).toEqual(length);
      scope.items.splice(0, 1);
      expect(element.find('li').length).toEqual(length);
      scope.items = [];
      scope.$apply();
      expect(element.find('li').length).toEqual(scope.items.length);
    });

    it('should on dragstart create a placeholder node after current dragged element', () => {
      let dragElm = element.find('li').eq(0);
      triggerEvent(dragElm, 'dragstart');
      expect(dragElm[0].nextSibling.nodeValue).toContain('dnd-placeholder');
    });

    it('should on dragover move dragged element to be before the dragover node', () => {
      let itemElms = element.find('li');
      let dragElm = itemElms.eq(0);
      let dropElm = itemElms.eq(1);

      triggerEvent(dragElm, 'dragstart');
      triggerEvent(dropElm, 'dragover', {pageY: dropElm.offset().top - 1});
      
      expect(Array.prototype.indexOf.call(element.children(), dragElm[0])).toEqual(0);
    });

    it('should on dragover move dragged element to be after the dragover node', () => {
      let itemElms = element.find('li');
      let dragElm = itemElms.eq(0);
      let dropElm = itemElms.eq(1);

      triggerEvent(dragElm, 'dragstart');
      triggerEvent(dropElm, 'dragover', {pageY: dropElm.offset().top + 1});

      expect(Array.prototype.indexOf.call(element.children(), dragElm[0])).toEqual(1);
    });

    it('should on dragend call endDrag()', () => {
      spyOn(dragAndDropService, 'endDrag');
      triggerEvent(element.find('li').eq(0), 'dragend');
      expect(dragAndDropService.endDrag).toHaveBeenCalled();
    });

    it('should on drop move dragged model to drop model at drop index', () => {
      let name = scope.items[0].name;

      let itemElms = element.find('li');
      let dragElm = itemElms.eq(0);
      let dropElm = itemElms.eq(1);

      triggerEvent(dragElm, 'dragstart');
      triggerEvent(dropElm, 'dragover');
      triggerEvent(dropElm, 'drop');
      triggerEvent(dragElm, 'dragend');

      expect(scope.items[1].name).toEqual(name);
    });

    it('should on drop copy dragged model to drop model at drop index', () => {
      scope.dndType = 'copy';
      scope.$apply();

      let itemElms = element.find('li');
      let dragElm = itemElms.eq(0);
      let dropElm = itemElms.eq(1);

      triggerEvent(dragElm, 'dragstart');
      triggerEvent(dragElm, 'dragover');
      triggerEvent(dropElm, 'drop');
      triggerEvent(dragElm, 'dragend');

      expect(scope.items[0].name).toEqual(scope.items[1].name);
    });

    it('should on dragend move back dragged element to its original dom position', () => {
      let itemElms = element.find('li');
      let dragElm = itemElms.eq(0);
      let dropElm = itemElms.eq(1);

      triggerEvent(dragElm, 'dragstart');
      triggerEvent(dropElm, 'dragover');
      triggerEvent(dragElm, 'dragend');

      expect(Array.prototype.indexOf.call(element.children(), dragElm[0])).toEqual(0);
    });

    function triggerEvent(element, eventType, eventOpts) {
      let event = createEvent(eventType, eventOpts);
      element.trigger(event);
      scope.$apply();
    }

    function createEvent(type, opts) {
      let event = Object.assign(
        $.Event(type),
        opts
      );
      event.dataTransfer = {};
      event.dataTransfer.getData = function() { return this._dataTransfer; }
      event.dataTransfer.setData = function(data) { this._dataTransfer = data }
      return event;
    }

  });

});