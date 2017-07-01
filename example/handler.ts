
import { App } from './api/app';
const app = new App();
    
export const list = app.services.userService.list;
          
export const getById = app.services.userService.getById;
          
export const getSubscriptions = app.services.userService.getSubscriptions;
          
export const error = app.services.userService.error;
          