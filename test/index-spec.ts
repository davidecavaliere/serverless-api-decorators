import index = require('../src/index');
import * as chai from 'chai';
import * as mocha from 'mocha';

import * as Debug from 'debug';
import { Endpoint, Lambda, EndpointSymbol, LambdaSymbol } from '../src/decorators';

import * as DI from '../src/di';

const d = Debug('test');


@Endpoint({
  name: 'testService'
})
class TestService {

  public static count: number = 0;

  constructor() {
    // d('initing test service')
    TestService.count++;
    d('number of instances', TestService.count);
  }

  @Lambda({
    test: 'test'
  })
  public testMethod() {
    d('running testMethod', this);
  }
}



const expect = chai.expect;

describe('index', () => {
  it('should provide Greeter', () => {

    d('DI:', DI);



    const service = DI.getSingleton('testService');

    const serviceDef = (service as any)[EndpointSymbol];
    const endpointsDef = (service as any)[LambdaSymbol];

    expect(serviceDef).to.be.eql({ name: 'testService'}, 'should match provided config');

    expect(endpointsDef).to.be.eql([{ functionName: 'testMethod', test: 'test' }]);

  });
});
