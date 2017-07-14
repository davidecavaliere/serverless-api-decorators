import  * as Debug  from "debug";
import {Endpoint, Lambda} from "sls-api-decorators/lib/decorators";

const debug = Debug('stories-service');

@Endpoint({
  name: 'storyService',
  path: 'stories',
  xOrigin: true
})
class StoryService {


  constructor() {

    debug('Initing StoryService');
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

    return [{
      id: 1,
      title: 'Il nome della rosa',
      author: 'Umberto Eco'
    }];

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
      id: 1,
      title: 'Il nome della rosa',
      author: 'Umberto Eco'
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

export { StoryService };
