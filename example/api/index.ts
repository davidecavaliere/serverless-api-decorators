
import { App } from './app';

const app = new App();

console.log(app);
console.log('services', app.services);

// export const _app = app.service.userService;



export const echo  = app.services.userService.list;
export const hello = app.services.userService.error;
