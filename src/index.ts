import * as Debug from 'debug';
import { EndpointSymbol, LambdaSymbol } from './decorators';
import * as path from 'path';
//
const d = Debug('sls-api-dec');

const debug = d;


class Serverless {
  constructor(serverless: any, options: any) {
    // debug('serverless', serverless.pluginManager);

    const services = serverless.service.custom.services;
    const artifactsPath = serverless.service.custom.artifactsFolder;
    debug('articafacts folder', artifactsPath);
    debug('cwd', __dirname);

    const servicePath = serverless.config.servicePath;
    const functions = serverless.service.functions;
    // debug('functions: ', functions);


    try {

      const serviceInstances = require(path.join(servicePath, artifactsPath)).services;
      debug('serviceInstances: ', serviceInstances);

      for (const serviceName of Object.keys(serviceInstances)) {
        debug('serviceName: ', serviceName);
        const service = serviceInstances[serviceName];
        debug('service:', service[EndpointSymbol]);

        const serviceDescription = service[EndpointSymbol];
        debug('serviceDescription', serviceDescription);
        const endpoints = service[LambdaSymbol];
        debug('endpoints', endpoints);

        debug('adding functions');

        for (const endpoint of endpoints) {
          debug('registering endpoint', endpoint);
          const name = endpoint.name;
          const funcName = endpoint.functionName;
          functions[name] = {
            handler: `index.services.${serviceDescription.name}.${funcName}`,
            events: [
              {
                http:  {
                  path: path.join(serviceDescription.path, endpoint.path),
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
