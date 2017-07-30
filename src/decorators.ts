import * as Debug from 'debug';
import { registerSingleton, getSingleton } from './di';

const debug = Debug('annotations');
const d = Debug('respect-this');

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


    debug('-------------------descriptor--------------------');
    debug(descriptor);
    debug('function name:', key);

    debug('Running function annotation');
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




    const originalFunction = target[key];


    return target[key] = (...args: any[]) => {
      debug('hijacked function');
      debug('original function:', originalFunction);
      let _args = annotate(originalFunction);
      debug('function arguments', _args);

      d('getting singleton for service:', target['__service__'].name);

      const lexicalThis = getSingleton(target['__service__'].name);

      d('singleton is available', lexicalThis);

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
            if (event && event.path && event.path.hasOwnProperty(arg)) {
              return event.path[arg];
            }

            return undefined;
          });

          debug('new arguments:', newArgs);

          debug('context is:', target.constructor);
          const response = originalFunction.apply(lexicalThis, newArgs);
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

const FN_ARGS = /^[a-zA_Z]\s*[^\(]*\(\s*([^\)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function annotate(fn: any) {
  const $inject: string[] = [];
  let fnText;
  let argDecl;
  let last;

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
