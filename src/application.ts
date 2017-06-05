import * as DI from './di';

import * as Debug from 'debug';
const d = Debug('@Api');


export const Api = (config: any) => {
  return (target: any) => {
    // import
    d('Running decorator on:', target.prototype, config);
    // create a new instance of App class and store it in DI for future ref


    target.prototype['DI'] = DI;
    target.prototype['factories'] = DI.getFactories();
    target.prototype['services'] = DI.getServices();


    // instantiate Factories and Services

  }
}
