# Serverless api decorators
[![Build Status](https://travis-ci.org/davidecavaliere/serverless-api-decorators.svg?branch=master)](https://travis-ci.org/davidecavaliere/serverless-api-decorators)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

sls-api-decorator is a PoC on using typescript decorators to decorate classes that rapresents a service (in serverless idiom) and their methods that will map to endpoints. It supports only aws lambdas.

It basically allow the developer to define a set of aws lambda functions as methods of the same class.

Loading the sls-api-decorators plugin will automatically generate the lambda definitions in serverless.yaml

```typescript
@Service()
export class MyService {

  @Endpoint()
  public sayHello(event) {
    return { message : 'Hello there'}
  }
}
```

`sayHello` function is wrapped in a promise and will automatically handle thrown errors.

# How to use
<!--
For a quick start clone [http://github.com/davidecavaliere/sls-api-decorator-example](http://github.com/davidecavaliere/sls-api-decorator-example)

check out git's history with `git log -p --reverse`. -->

#### Create a serverless project

``sls create -t aws-nodejs``

- specify your service name and comment out `functions` section

####Install serverless-webpack plugin

- `npm i -S serverless-webpack`

set up to run with typescript

```
 npm i -S typescript ts-node
```

```yaml
plugins:
  - serverless-webpack
```
create webpack.config.js

```js
// webpack.config.js

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './api/index.ts',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'index.js'
  },
  target: 'node',
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '']
  },
};
```

create tsconfig.json

```js
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

add npm scripts

```json
  "scripts": {
    "start": "npm run webpack",
    "webpack": "sls webpack serve'"
  }
```

#### Install sls-api-decorators

```npm i -S sls-api-decorators```

Edit you plugins section and add typescript output folder.

```yaml
plugins:
  - serverless-webpack
  # this will dynamically set the functions in serverless.yaml
  - sls-api-decorators

custom:
  # this will be the same output folder set up in webpack.config.js
  artifactsFolder: .webpack

```

create `api/user/user.service.ts`

The following will define a service with base path users that will expose two endpoints:
- users/
- users/error

The latter being to demostrate error throwing.

```typescript
// user.service.ts

import  * as Debug  from "debug";
   import {Service, Endpoint} from "sls-api-decorators";


   const debug = Debug('bazooka');


   @Service({
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

     @Endpoint({
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

     @Endpoint({
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

create `api/index.ts`

The following will expose the service to be used by serverless

_this should be replaced in future versions by a DI system_

```typescript
// api/index.ts



import  * as Debug  from 'debug';

let debug = Debug('entry-ts');

import {UserService} from './user/user.service';

debug('UserSErvice', UserService.prototype);

const serviceDefinition = (UserService.prototype as any)['service'];

debug('serviceDef', serviceDefinition);

let services = {};

const userService = new UserService();
const serviceName = serviceDefinition.name;

services[serviceName] = userService;

debug('services:', services);

export { services };
```

run `npm start` sit back and start coding :)
