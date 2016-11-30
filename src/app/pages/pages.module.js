import angular from 'angular';
import { LibraryModule } from './library/library.module';

export const PagesModule = angular
  .module('app.pages', [
    LibraryModule
  ])
  .name
  ;