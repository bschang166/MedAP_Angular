import angular from 'angular';
import rx from 'rx-angular';

import { FiltersModule } from '../../filters/app.filters.module';

import { LibraryService } from './library.service';
import { LibraryComponent } from './library.component';
import { AddBookFormComponent } from './addBookForm/addBookForm.component';

export const LibraryModule = angular
  .module('app.pages.library', [
    'rx',
    FiltersModule,
  ])
  .service('LibraryService', LibraryService)
  .component('library', LibraryComponent)
  .component('addBookForm', AddBookFormComponent)
  .name
  ;