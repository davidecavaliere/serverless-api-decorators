
import { App } from './api/app';
const app = new App();

console.log(app);
console.log('services', app.services);

export const error = app.services.userService.error;

export const hello = app.services.userService.list;
    