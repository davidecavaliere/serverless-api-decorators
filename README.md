# Serverless api decorators
[![Build Status](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/{{github-user-name}}/{{github-app-name}}/badge.svg?branch=master)](https://coveralls.io/github/{{github-user-name}}/{{github-app-name}}?branch=master)

Supports only aws lambdas.

# Preliminary Setup

####Create a serverless project

``sls create -t aws-nodejs``

- specify your service name and comment out `functions` section

####serverless-webpack plugin

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

install sls-api-decorators

```npm i -S sls-api-decorators```

create `api/user/user.service.ts`

```typescript
// user.service.ts

import  * as Debug  from "debug";
   import {Service, Endpoint} from "sls-api-decorators";
   
   
   const debug = Debug('bazooka');
   
   
   @Service({
     name: 'userService',
     path: 'users',
     xOrigin: true
   })
   class UserService {
     constructor() {
   
       debug('Initing UserService');
     }
   
     @Endpoint({
       name: 'hello',
       path: '/',
       method: 'get',
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
       throw new Error('something weird just happened');
     }
   }
   
   export { UserService };
```

create `api/index.ts`

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

define your functions in `serverless.yaml`

```yaml
functions: 
  hello: 
    handler: index.services.userService.welcome 
 
#    The following are a few example events you can configure 
#    NOTE: Please make sure to change your handler code to work with those events 
#    Check the event documentation for details 
    events: 
      - http: 
          path: users 
          method: get 
          integration: lambda 
  error: 
    handler: index.services.userService.error 
    events:  
      - http: 
          path: users/error 
          method: get 
          integration: lambda 

```

run `npm start` sit back and start coding :)
