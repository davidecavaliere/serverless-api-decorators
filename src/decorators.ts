import * as Debug from 'debug';

const debug = Debug('annotations');

export const EndpointSymbol = '__service__';
export const LambdaSymbol = '__endpoints__';

export interface ServiceConfiguration {
  name: string;
  path: string;
  xOrigin: boolean;
};

export const Endpoint = (config: Object) => {


  debug('Creating class annotation');
  return (target: any) => {
    debug('Running class annotation');

    target.prototype[EndpointSymbol] = config;

    debug('conf injected', target.prototype[EndpointSymbol]);


  };
}


export const Lambda = (config: Object) => {
  debug('Creating function annotatiion');
  debug(config);

  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    // let functName = target;

    debug('function name:', key);

    debug('Running function annotation');
    // debug('target space:', functName);
    debug('-----------------parent proto------------');
    debug(Object.getOwnPropertyNames(target.constructor.prototype));

    const targetProto = target.constructor.prototype;

    if (!targetProto[LambdaSymbol]) {
      targetProto[LambdaSymbol] = [];
    }

    // setting real function name
    (config as any)['functionName'] = key

    target.constructor.prototype[LambdaSymbol].push(config);

    debug('endpoint defined', target.constructor.prototype);

    // debug('target constructor: ', target.constructor);
    // debug('keys:', Object.keys(target));
    // debug('key', key);
    // debug('descriptor', descriptor);

    // debug('config added', Object.keys(config));

    // Object.defineProperty(target, (config as any)['name'] + '-config', {
    //   value: config,
    //   writable: true,
    //   enumerable: true,
    //   configurable: true
    // });


    const originalFunction = target[key];

    return target[key] = (...args: any[]) => {
      debug('hijacked function');
      debug('event', args[0]);
      const event = args[0];
      debug('context', args[1]);
      // debug('cb', args[2])
      const cb = args[2];
      // function should only handle the event and resolve, reject of a promise
      const promise = new Promise((resolve, reject) => {
        debug('promising sanitation');
        try {
          const response = originalFunction.call(target, event);
          resolve(response);
        } catch (e) {
          debug('error calling handler', e.toString());

          // in development mode we always want to resolve
          // this will avoid the 'watched' function execution
          // to be interrupted
          // in prod/staging etc... etc... we want to reject
          // so AWS will be informed of the error

          // TODO: need to get enviroment info

          // reject(e);
          resolve({message : e.toString()});
        }
      });


      promise.then((response) => {
        debug('handling response', response);
        cb(null, response);
      });

      promise.catch((err) => {
        debug('promise cought error', err);
        // same as comment above
        // cb(err);
        cb(null, err);
      })
    }
  }
}
