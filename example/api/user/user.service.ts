import  * as Debug  from "debug";
import {Endpoint, Lambda} from "sls-api-decorators/lib/decorators";
// import { Factory } from 'sls-api-decorators/lib/models';
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
    // debug('User Factory', this.User);


  }

  @Lambda({
    name: 'list',
    path: '/',
    method: 'get',
    integration: 'lambda'
  })
  public list(event, offset, limit) {
    debug('Running welcome');

    return { message: 'Go Serverless Webpack (Typescript) v1.0! Your function xecuted successfully!', event: event };

  }

  @Lambda({
    name: 'getById',
    path: '/{id}',
    method: 'get',
    integration: 'lambda'
  })
  public getById(id) {
    debug('Running get by id:', id);

    return {
      id: 'abc',
      name: 'dcavaliere',
      email: 'cavaliere.davide@gmail.com'
     };

  }

  @Lambda({
    name: 'getSubscriptions',
    path: '/{id}/subscriptions',
    method: 'get',
    integration: 'lambda'
  })
  public getSubscriptions(id) {
    debug('Running get by id:', id);

    return ['Playboy', 'Penthouse'];

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
