import * as Debug from 'debug';
import { registerSingleton } from './di';

const debug = Debug('annotations');

export const EndpointSymbol = '__service__';
export const LambdaSymbol = '__endpoints__';


export interface ServiceConfiguration {
  name: string;
  path: string;
  xOrigin: boolean;
}
;

export const Endpoint = (config: Object) => {


  debug('Creating class annotation');
  return (target: any) => {
    debug('Running class annotation');

    target.prototype[EndpointSymbol] = config;

    debug('conf injected', target.prototype[EndpointSymbol]);


    registerSingleton(target);

  };
}


export const Lambda = (config: Object) => {
  debug('Creating function annotatiion');
  debug(config);

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
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
      debug('original function:', originalFunction);
      let _args = annotate(originalFunction);
      debug('function arguments', _args);


      debug('event', args[0]);
      const event = args[0];
      debug('context', args[1]);
      debug('cb', args[2])
      const cb = args[2];
      // function should only handle the event and resolve, reject of a promise
      const promise = new Promise((resolve, reject) => {
        debug('promising sanitation');
        try {
          let newArgs = _args.map((arg: any) => {
            debug('parsing arg for injection:', arg);
            if (arg === 'event') {
              return event;
            }
            return event.path[arg];
          });

          debug('new arguments:', newArgs);

          const response = originalFunction.apply(target, newArgs);
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
          resolve({message: e.toString()});
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

var FN_ARGS = /^[a-zA_Z]\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function annotate(fn: any) {
  var $inject: string[] = [],
      fnText,
      argDecl,
      last;

  debug('extracting arguments from fn:', fn);

  if (typeof fn == 'function') {
    debug('function is a function!');
    fnText = fn.toString().replace(STRIP_COMMENTS, '');
    debug('fnText', fnText);
    argDecl = fnText.match(FN_ARGS);
    debug('argDecl', argDecl);
    argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg: any){
      arg.replace(FN_ARG, function(all: any, underscore: any, name: any){
        $inject.push(name);
      });
    });

  } else if (false) {
    // last = fn.length - 1;
    // assertArgFn(fn[last], 'fn')
    // $inject = fn.slice(0, last);
  } else {
    // assertArgFn(fn, 'fn', true);
  }
  return $inject;
}
