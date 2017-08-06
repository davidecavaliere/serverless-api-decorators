import * as Debug from 'debug';
import { EndpointSymbol, LambdaSymbol } from './decorators';
import * as path from 'path';
import * as fs from 'fs';
//
import Ast from 'ts-simple-ast';
//
import * as ts from 'typescript';
const tsc = require('node-typescript-compiler');


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
    const artifactsPath = serverless.service.custom.artifactsFolder;
    const apiFolder = serverless.service.custom.apiFolder;
    debug('articafacts folder', artifactsPath, apiFolder);
    debug('cwd', __dirname);

    const functions = serverless.service.functions;

    const projectCompiled = this.compileProject(servicePath);


    // debug('hooks:', serverless.pluginManager.hooks);
    // define sls hooks
    this.hooks = {
      'before:package:initialize': () => {

        return new Promise((res, rej) => {
          projectCompiled.then(() => {
            serverless.cli.log('re compiling project');
            this.compileProject(servicePath).then(() => {
              serverless.cli.log('project compiled successfully');
              res(true);
            })
          })
        });
      },

      'before:invoke:local:invoke': () => {

        return new Promise((res, rej) => {
          projectCompiled.then(() => {
            serverless.cli.log('re compiling project');
            this.compileProject(servicePath).then(() => {
              serverless.cli.log('project compiled successfully');
              res(true);
            })
          })
        });
      }
    };

    const ast = new Ast({
      compilerOptions: {
        out: `${servicePath}/${artifactsPath}`,
        target: ts.ScriptTarget.ES5
      }
    });


    // this.getConfiguration();
    //
    // const apiPath = path.join(servicePath, apiFolder, '*.ts');
    // console.log('apiPath', apiPath);
    // ast.addSourceFiles(apiPath);
    //
    // const  indexTs = ast.getSourceFile('index.ts');
    //
    // const varDec = indexTs.getVariableDeclarations();
    // varDec.forEach((v) => {
    //   console.log('v-dec: ',v.get);
    // });
    //
    //
    // const vars = indexTs.getVariableStatements();
    //
    // vars.forEach((v) => {
    //
    //   d('var:', v.getText());
    // });
    //
    //
    // const  sourceTs = ast.getSourceFile('app.ts');
    // const decorator = sourceTs.getClasses()[0].getDecorators()[0];
    //
    //
    // const callExpression = decorator.getCallExpression()!.compilerNode;
    // const arg = callExpression.arguments[0];
    // const appDefinition = arg;
    // d('appDefinition')
    // d(appDefinition);

    // const appName = appDefinition.name;
    // const _services = appDefinition.services;

    // d(appName, _services);

    // console.log('', sourceTs.getExports());
    //
    // for (const c of sourceTs.getClasses()) {
    //   // console.log(c);
    //   for (const d of c.getDecorators()) {
    //     console.log('decorators:', d);
    //
    //   }
    // }

    // console.log('------', sourceTs.getClasses());

    let handlerjs = `
import { App } from './${apiFolder}/app';
const app = new App();
    `


    projectCompiled.then(() => {
      serverless.cli.log('api compiled');

      try {
        serverless.cli.log('writing handler.ts');
        const req = path.join(servicePath, artifactsPath);
        // debug('requiring: ', req);

        const serviceInstances: any = require(req).services;
        // debug('serviceInstances: ', serviceInstances);

        // 5th of august 2017 incurring in the following bug: https://github.com/serverless/serverless/issues/2614
        // adding random prefix as a workaround

        for (const serviceName of Object.keys(serviceInstances)) {
          // debug('serviceName: ', serviceName);
          const service = serviceInstances[serviceName];
          // debug('service:', service[EndpointSymbol]);

          const serviceDescription = service[EndpointSymbol];
          // debug('serviceDescription', serviceDescription);
          const endpoints = service[LambdaSymbol];
          // debug('endpoints', endpoints);

          // debug('adding functions');
          serverless.cli.log(`injecting configuration for service: ${serviceName}`);

          for (const endpoint of endpoints) {
            let prefix = Math.random().toString(36).substring(21);

            // debug('registering endpoint', endpoint);
            const name = endpoint.name;
            const funcName = endpoint.functionName;


            handlerjs += `
  export const ${serviceDescription.name}_${funcName} = app.services.${serviceDescription.name}.${funcName};
            `
            const functionName = `${awsService}${serviceDescription.name}${funcName}`;
            serverless.cli.log(`configuring function: ${functionName}`);

            const endpointPath = path.join(serviceDescription.path, endpoint.path);
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
                {
                  cloudwatchLog: {
                    logGroup: `${awsService}${functionName}`
                  }
                }
              ]
            }

          }

        }

        const sourceFile = ast.addSourceFileFromText(path.join(servicePath, 'handler.ts'), handlerjs);

        sourceFile.saveSync();

        // ast.emit();

        serverless.cli.log('handler.ts saved');

        debug('final configuration: functions list');
        debug(functions);

      } catch (e) {
        console.log('error', e);
      }

    });


  }

  private compileProject(servicePath: string) {
    return tsc.compile({
      project: servicePath
    });
  }

  private injectConfiguration() {

  }

  private getConfiguration() {

  }
}

export = Serverless;
