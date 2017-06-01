import * as Debug from 'debug';
import { ServiceSym, EndpointsSym } from './decorators';
import * as path from 'path';
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
      const serviceInstances = require('../../../.webpack').services;
      debug('serviceInstances: ', serviceInstances);

      for (let serviceName of Object.keys(serviceInstances)) {
        debug('serviceName: ', serviceName);
        const service = serviceInstances[serviceName];
        debug('service:', service[ServiceSym]);

        const serviceDescription = service[ServiceSym];
        debug('serviceDescription', serviceDescription);
        const endpoints = service[EndpointsSym];
        debug('endpoints', endpoints);

        debug('adding functions');

        for (let endpoint of endpoints) {
          debug('registering endpoint', endpoint);
          const name = endpoint.name;
          const funcName = endpoint.functionName;
          functions[name] = {
            handler: `index.services.${serviceDescription.name}.${funcName}`,
            events: [
              {
                http:  {
                  path: path.join(serviceDescription.path,endpoint.path),
                  method: endpoint.method,
                  integration: endpoint.integration
                }
              }
            ]
          }
        }


      }

    } catch (e) {
      console.log('error', e);
    }

  }
}

export = Serverless;
