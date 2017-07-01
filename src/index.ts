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

    const handlerjs = `
import { App } from './api/app';
const app = new App();

console.log(app);
console.log('services', app.services);

export const error = app.services.userService.error;

export const hello = app.services.userService.list;
    `

    const servicePath = serverless.config.servicePath;
    debug('servicePath:', servicePath);
    const sourceFile = ast.addSourceFileFromText(path.join(servicePath, 'handler.ts'), handlerjs);

    sourceFile.saveSync();

    const services = serverless.service.custom.services;
    const artifactsPath = serverless.service.custom.apiFolder;
    debug('articafacts folder', artifactsPath);
    debug('cwd', __dirname);

    const functions = serverless.service.functions;
    // debug('functions: ', functions);

    try {
      const req = path.join(servicePath, artifactsPath);
      debug('requiring: ', req);

    //  const property = result.getFile("TestFile.ts")
    //      .getClass("MyClass")                            // get first by name
    //      .getProperty(p => p.defaultExpression != null); // or first by what matches
    //
    //  console.log(property.name);                   // myNumberProperty
    //  console.log(property.type.text);              // number
    //  console.log(property.defaultExpression.text); // 253
    //  console.log(property.isReadonly);             // true

     // or access the arrays directly
    //  const myMethod = result.files[0].classes[0].methods[0];

    //  console.log(myMethod.name); // myMethod

    // const serviceInstances = require(req);
      const serviceInstances: any = {};
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

      debug('final configuration', functions);

    } catch (e) {
      console.log('error', e);
    }

  }
}

export = Serverless;
