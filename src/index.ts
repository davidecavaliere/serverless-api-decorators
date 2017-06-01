import * as Debug from 'debug';
import { ServiceSym, EndpointsSym } from './decorators';

//
const d = Debug('sls-api-dec');

const debug = d;


class Serverless {
  constructor(serverless: any, options: any) {
    // debug('serverless', serverless.pluginManager);

    const services = serverless.service.custom.services;

    const functions = serverless.service.functions;
    // debug('functions: ', functions);


    try {
      const serviceInstance = require('../../../.webpack');
      debug('serviceInstances: ', serviceInstance);

      const services = serviceInstance.services;

      debug('services', services);
      // debug(userService);


      for (const service of Object.keys(services)) {
        debug('parsing service', service);
        const proto = services[service];
        debug('prototype', proto);
        const serviceDescription = proto[ServiceSym];
        debug('serviceDescription', serviceDescription);
        const endpoints = proto[EndpointsSym];
        debug('endpoints', endpoints);

        debug('adding functions');

        // for (let endpoint of endpoints) {
        //   debug('registering endpoint', endpoint);
        //   const name = endpoint.name;
        //   const funcName = endpoint.functionName;
        //   // functions[name] = {
          //   handler: `index.services.${serviceDescription.name}.${funcName}`,
          //   events: [
          //     {
          //       http:  {
          //         path: path.join(serviceDescription.path,endpoint.path),
          //         method: endpoint.method,
          //         integration: endpoint.integration
          //       }
          //     }
          //   ]
          // }
        // }


      }

    } catch (e) {
      console.log('error', e);
    }


    // for (let service of services) {
    //   let options = services[service];
    //   debug('service: ', service, options);
    //
    //
    //
    //
    //
    //   // let className = services['className'];
    //   // debug('className', className);
    //   //
    //   // let instance = new className();
    //   // debug('got instance', instance);
    //
    //   // if (functions.hasOwnProperty())
    //
    //
    // }





    // for (let func in functions) {
    //   debug('function name:', func);
    //   debug('function handler', functions[func].handler);
    //   debug('function events', functions[func].events);
    //
    // }
  }
}

export = Serverless;
