import { Api } from 'sls-api-decorators/lib/application';
import { UserService } from './user/user.service';
import { StoryService } from './story/story.service';
import { User } from './user/user.model';
import * as Debug from 'debug';

const debug = Debug('app');


@Api({
  // used for DI purposes
  name : 'app',
  // need to define factories and servises
  factories: [User],
  services: [UserService, StoryService]
})
export class App {

  public services: any;
  public factories: any;

  constructor() {
    debug('------------------initing api class------------------------');
  }

}
