import { Api } from 'sls-api-decorators/lib/application';
import { UserService } from './user/user.service';
import { User } from './user/user.model';

import  * as Debug  from 'debug';
let debug = Debug('autoload-services');


@Api({
  // used for DI purposes
  name : 'app'
  // need to define factories and servises
  factories: [User],
  services: [UserService]
})
class App {

  constructor() {
    debug('------------------initing api class------------------------');
    debug(this.DI.getServices());
  }

}


const app = new App();
debug('app instance:', app);
debug('services:', app.services);
debug('factories:', app.factories);
export { app };
