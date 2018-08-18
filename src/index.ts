import { getServiceMetadata, getEndpointMetadata} from '@microgamma/apigator';
import 'reflect-metadata';
import * as Debug from 'debug';

const debug = Debug('sls-dec:index.ts');

class Serverless {

  private servicePath: string;

  public hooks: any = {};


  constructor(private serverless: any, private options: any) {

    serverless.cli.log('Parsing Service definition');
    this.servicePath = serverless.config.servicePath;
    debug('servicePath:', this.servicePath);

    const awsService = serverless.service.service;
    debug('awsService name', awsService);

    const services = serverless.service.custom.services;
    debug('pre defined services', services);
    const artifactsPath = serverless.service.custom.artifactsFolder;
    const apiFolder = serverless.service.custom.apiFolder;
    debug('articafacts folder', artifactsPath, apiFolder);

    this.hooks = {
      'before:package:initialize': () => {
        debug('before:package:initialize');
        return this.configureFunctions();
      },

      'before:invoke:local:invoke': () => {
        debug('before:invoke:local:invoke');
        return this.configureFunctions();
      }
    };
  }

  public configureFunctions() {

    return import(`${this.servicePath}/lib/handler`).then((module) => {

      this.serverless.cli.log('Injecting configuration');
      debug('works', module);

      const service = module;

      debug('metadata', Reflect.getMetadataKeys(service));
      debug('Service', getServiceMetadata(service));
      debug('Endpoints', getEndpointMetadata(service));

      const endpoints = getEndpointMetadata(service);

      for (const endpoint of endpoints) {
        debug('configuring endpoint', endpoint);
        const functionName = endpoint.name;

        this.serverless.service.functions[endpoint.name] = {
          handler: `lib/handler.${functionName}`,
          events: [
            {
              http:  {
                path: endpoint.path,
                method: endpoint.method,
                integration: 'lambda',
                cors: true
              }
            }
          ]
        }

        debug('functions is');
        debug(this.serverless.service.functions[endpoint.name]);
        debug(this.serverless.service.functions[endpoint.name].events);
      }

      this.serverless.cli.log(`${endpoints.length} endpoints configured`);

    });
  }
}

export = Serverless;
