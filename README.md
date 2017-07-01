# Serverless api decorators
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Build Status](https://travis-ci.org/davidecavaliere/serverless-api-decorators.svg?branch=master)](https://travis-ci.org/davidecavaliere/serverless-api-decorators)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

This project is mean to simplify and make more elegant aws lambda development in typescript and automatically handle the serverless configuration file.

This is still under heavy development.  

Features:
  - define your service as a class annotating it to provide configuration
  - define lambdas as methods of a class and annotate them to provide configuration
  - lambdas are automatically wrapped into a promise
  - path and query parameters are automatically injected into the lambda
  - support for parameters validation
  - no need to change serverless.yml

At a glance:
```typescript
@Endpoint(
  // define configuration here
)
export class MyService {

  @Lambda(
    // define configuration
  )
  public sayHello(event) {
    return { message : 'Hello there'}
  }
}
```

Look into the example folder for a working example

# How to use

#### Create a serverless project

``sls create -t aws-nodejs``

- specify your service name and comment out `functions` section

### TBD. instruction on how to set up for ts lambdas

#### Install sls-api-decorators

```npm i -S sls-api-decorators```

Edit you plugins section and add typescript output folder.

```yaml
plugins:
  # this will dynamically set the functions in serverless.yaml
  - sls-api-decorators

custom:
  # this will be your ts output folder
  artifactsFolder: lib

```

create `api/user/user.service.ts`

The following will define a service with base path users that will expose two endpoints:
- users/
- users/error

The latter being to demostrate error throwing.

```typescript
// user.service.ts
import {Service, Endpoint} from "sls-api-decorators";


@Endpoint({
  // name of the service (not in the serverless meaning of service)
  // will be used in the future for di purpose
  name: 'userService',
  // this will rapresent the base path for this service
  // i.e.: http://localhost:8000/users
  path: 'users',
  // Allow xOrigin request [TBD]
  xOrigin: true
})
class UserService {
  constructor() { }

  @Lambda({
    // name to reference this method in the serverless ecosystem
    // i.e.: to be used with invoke command
    name: 'hello',
    // sub-path for this endpoint
    // i.e.: http://localhost:8000/users/
    path: '/',
    // method to which this function should listen
    // i.e.: 'get' or ['get', 'post'] [TBD]
    method: 'get',
    // this is just required from serverless-webpack plugin
    integration: 'lambda'
  })
  public welcome(event) {
    debug('Running welcome');

    return { message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!', event };

  }

  // demostrate use of path params and arguments injection
  // arguments being injected from event.path
  @Lambda({
    name: 'getById',
    path: '/{id}',
    method: 'get',
    integration: 'lambda'
  })
  public getById(id) {
    debug('Running get by id:', id);

    return {
      id: 'abc',
      name: 'dcavaliere',
      email: 'cavaliere.davide@gmail.com'
     };

  }

  @Lambda({
    name: 'error',
    path: 'error',
    method: 'get',
    integration: 'lambda'
  })
  public error(event) {
    debug('throwing an error');
    // throwing an error will reject the lambda cb
    throw new Error('something weird just happened');
  }
}

export { UserService };
```

create `api/app.ts`

The following will expose the service to be used by serverless

_this should be replaced in future versions by a DI system_

```typescript
// api/app.ts
import { Api } from 'sls-api-decorators/lib/application';
import { UserService } from './user/user.service';
import { User } from './user/user.model';

@Api({
  // used for DI purposes
  name : 'app',
  // need to define factories and servises
  factories: [User],
  services: [UserService]
})
export class App {

  public services: any;
  public factories: any;

  constructor() {}

}
```

run `tsc -w &` now you can call `sls invoke local -f hello`

or deploy with `sls deploy`

Please note if you use the example you need to provide your own service name.
