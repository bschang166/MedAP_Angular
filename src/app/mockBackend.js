
import books from '../../data/books.json';

export default function($httpBackend) {
  $httpBackend.whenGET(/\/books(\?search=(.+))?(\?sortBy=(.+))?/).respond(() => {
    'ngInject';
    return [200, books, {}];
  });

  $httpBackend.whenPUT('/books').respond((method, url, data) => {
    'ngInject';
    books.push(JSON.parse(data));
    return [200, books, {}];
  });
}