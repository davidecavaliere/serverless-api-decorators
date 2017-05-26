import  * as Debug  from "debug";

const debug = Debug('bazooka');

export const AnnotationFactory = (prop: any) => {


  debug('Creating class annotation', prop);
  return Annotation;
}

export const Annotation = (target: any) => {
  debug('Running class annotation');
  debug(target);
};

export const FunctionAnn = (prop: any) => {
  debug('Creating function annotatiion');
  debug(prop);

  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    debug('Running function annotation');
    debug('target', target);
    debug('key', key);
    debug('descriptor', descriptor);

    let originalFunction = target[key];

    return target[key] = (...args) => {
      debug('hijacked function');
      debug('event', args[0]);
      let event = args[0];
      debug('context', args[1]);
      // debug('cb', args[2])
      let cb = args[2];
      // function should only handle the event and resolve, reject of a promise
      let promise = new Promise((resolve, reject) => {
        debug('promising sanitation');
        try {
          let response = originalFunction.call(target, event);
          resolve(response);
        } catch(e) {
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