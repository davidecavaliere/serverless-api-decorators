import * as Debug from 'debug';
import { EndpointSymbol, LambdaSymbol } from './decorators';
import * as path from 'path';
import * as fs from 'fs';
//
import Ast from "ts-simple-ast";
//
import * as ts from "typescript";


const debug = Debug('sls-plugin');

class Serverless {
  constructor(serverless: any, options: any) {
    // debug('serverless', serverless.pluginManager);
    debug('initing plugin');
    const ast = new Ast({
      compilerOptions: {
        target: ts.ScriptTarget.ES3
      }
    });

    let handlerjs = `
import { App } from './api/app';
const app = new App();
    `

    const servicePath = serverless.config.servicePath;
    debug('servicePath:', servicePath);


    const services = serverless.service.custom.services;
    const artifactsPath = serverless.service.custom.artifactsFolder;
    debug('articafacts folder', artifactsPath);
    debug('cwd', __dirname);

    const functions = serverless.service.functions;

    try {
      const req = path.join(servicePath, artifactsPath);
      debug('requiring: ', req);

      const serviceInstances: any = require(req).services;
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


          handlerjs += `
export const ${funcName} = app.services.${serviceDescription.name}.${funcName};
          `

          functions[name] = {
            handler: `handler.${funcName}`,
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

      const sourceFile = ast.addSourceFileFromText(path.join(servicePath, 'handler.ts'), handlerjs);

      sourceFile.saveSync();

      debug('handler.ts saved');

      debug('final configuration');
      debug(functions);

    } catch (e) {
      console.log('error', e);
    }

  }
}

export = Serverless;
