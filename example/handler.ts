
      import { App } from './api/app';



      const app = new App();




      // var index = require('./.webpack');
      // //
      console.log(app);
      console.log('services', app.services);


      export const functions = {
        test: (event, context, cb) => {
          cb({message: 'hello world!'});
        },

        sayHello: (event, context, cb) => {
          cb({message: 'hello world!'});
        },


      }

      export const error = app.services.userService.error;





      export const hello = app.services.userService.list;
    