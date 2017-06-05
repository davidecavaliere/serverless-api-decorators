// api/index.ts
import { Api } from 'sls-api-decorators/lib/application';
import { UserService } from './user/user.service';


import  * as Debug  from 'debug';
let debug = Debug('autoload-services');


@Api({
  // used for DI purposes
  name : 'app',
  // need to define factories and servises
  // factories: [User],
  services: [UserService]
})
export class ApiServer {

  constructor() {
    debug('------------------initing api class------------------------');
    // debug(this.DI.getServices());
  }

}


const app = new ApiServer();
debug('app instance:', app);
// debug('services:', app.services);
// debug('factories:', app.factories);
export { app };
