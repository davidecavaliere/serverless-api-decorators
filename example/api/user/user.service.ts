import  * as Debug  from "debug";
import {Endpoint, Lambda} from "sls-api-decorators/lib/decorators";
import { Factory } from 'sls-api-decorators/lib/models';
// import { User } from './user.model';

const debug = Debug('bazooka');




@Endpoint({
  name: 'userService',
  path: 'users',
  xOrigin: true
})
class UserService {


  // @Factory()
  // private User: User;


  constructor() {

    debug('Initing UserService');
    debug('User Factory', this.User);


  }

  @Lambda({
    name: 'hello',
    path: '/',
    method: 'get',
    integration: 'lambda'
  })
  public welcome(event) {
    debug('Running welcome');

    return { message: 'Go Serverless Webpack (Typescript) v1.0! Your function xecuted successfully!' };

  }

  @Lambda({
    name: 'error',
    path: 'error',
    method: 'get',
    integration: 'lambda'
  })
  public error(event) {
    debug('throwing an error');
    throw new Error('something weird just happened');
  }
}

export { UserService };
