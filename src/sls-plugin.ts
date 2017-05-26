import * as Debug from 'debug';

const debug = Debug('sls-spring-fw');

export class ServerlessPlugin {

  constructor(serverless: any, options: any) {
    debug('-----------------------')
    debug('serverless', options);
    debug('-----------------------');


  }
}
