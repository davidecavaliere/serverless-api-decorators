
import { App } from './app';

const app = new App();

console.log('exporting app', app);

// app.services.userService.list();
module.exports = app;
