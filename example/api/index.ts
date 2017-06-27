import { App } from './app';


import * as Debug from 'debug';
// let debug = Debug('autoload-services');
const debug = console.log;

const app = new App();
debug('app instance:', app);
debug('services:', app.services);
debug('factories:', app.factories);


export const error = app.services.userService.error;

export const hello = app.services.userService.list;
