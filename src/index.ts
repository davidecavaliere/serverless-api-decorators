// import Ast from 'ts-simple-ast';
// import * as ts from 'typescript';


import * as Debug from 'debug';
import {EndpointSymbol, LambdaSymbol} from "./decorators";

const debug = Debug('sls-plugin');
const d = Debug('auto-conf');


class Serverless {
  public hooks: any = {};

  constructor(serverless: any, options: any) {
    // debug('serverless', serverless.pluginManager);

    debug('initing plugin');

    serverless.cli.log('Compiling api')

    const servicePath = serverless.config.servicePath;
    debug('servicePath:', servicePath);

    const awsService = serverless.service.service;
    debug('awsService name', awsService);

    const services = serverless.service.custom.services;
    d('pre defined services', services);
    const artifactsPath = serverless.service.custom.artifactsFolder;
    const apiFolder = serverless.service.custom.apiFolder;
    debug('articafacts folder', artifactsPath, apiFolder);
    debug('cwd', __dirname);

    const functions = serverless.service.functions;




    // debug('hooks:', serverless.pluginManager.hooks);
    // define sls hooks
    this.hooks = {
      'before:package:initialize': () => {

        d('before:package:initialize');
        const appPath = [servicePath, 'lib', 'api'].join('/');

        const app = require(appPath);
        d('app is', app.services);

        const serviceInstances: any = app.services;
        debug('serviceInstances: ', serviceInstances);

        for (const serviceName of Object.keys(serviceInstances)) {
          const service = serviceInstances[serviceName];
          debug('service:', service[EndpointSymbol]);

          const serviceDescription = service[EndpointSymbol];
          debug('serviceDescription', serviceDescription);

          const endpoints = service[LambdaSymbol];
          debug('endpoints', endpoints);

          debug('adding functions');
          serverless.cli.log(`injecting configuration for service: ${serviceName}`);

          for (const endpoint of endpoints) {
            const prefix = Math.random().toString(36).substring(21);

            debug('registering endpoint', endpoint);
            const name = endpoint.name;
            const funcName = endpoint.functionName;

            const functionName = `${awsService}${serviceDescription.name}${funcName}`;
            serverless.cli.log(`configuring function: ${functionName}`);

            const endpointPath = [serviceDescription.path, endpoint.path].join('/');
            serverless.cli.log(`endpoint: ${endpointPath}`);

            functions[functionName] = {
              handler: `lib/handler.${serviceDescription.name}_${funcName}`,
              name: functionName,
              events: [
                {
                  http:  {
                    path: endpointPath,
                    method: endpoint.method,
                    integration: endpoint.integration,
                    cors: true
                  }
                },
                // {
                //   cloudwatchLog: {
                //     logGroup: `${awsService}${functionName}`
                //   }
                // }
              ]
            }

          }
        }
      },

      'before:invoke:local:invoke': () => {
        d('before:invoke:local:invoke');
      }
    };
  }
}

export = Serverless;
