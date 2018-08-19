import { getServiceMetadata, getEndpointMetadata} from '@microgamma/apigator';
import * as Debug from 'debug';

const debug = Debug('sls-dec:index.ts');

class Serverless {

  private servicePath: string;
  private artifactsPath: string;
  private entrypoint: string;
  private apiFolder: string;


  public hooks: any = {};


  constructor(private serverless: any, private options: any) {

    serverless.cli.log('Parsing Service definition');
    this.servicePath = serverless.config.servicePath;
    debug('servicePath:', this.servicePath);

    const awsService = serverless.service.service;
    debug('awsService name', awsService);

    const services = serverless.service.custom.services;
    debug('pre defined services', services);
    this.artifactsPath = serverless.service.custom.artifactsFolder;
    this.apiFolder = serverless.service.custom.apiFolder;
    this.entrypoint = serverless.service.custom.entrypoint;
    debug('entrypoint', this.entrypoint);

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

    debug('importing module');

    // const module = require(`${this.servicePath}/${this.entrypoint}`);
    const modulePath = `${this.servicePath}/${this.entrypoint}`;
    return import(modulePath).then((module) => {

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
          handler: `${this.entrypoint}.${functionName}`,
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

    }).catch((err) => {
      console.error(err);
    });
  }
}

export = Serverless;
