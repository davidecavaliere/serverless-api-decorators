import index = require('../src/index');
import * as chai from 'chai';
import * as mocha from 'mocha';

import * as Debug from 'debug';
import { Service, Endpoint, EndpointSymbol, LambdaSymbol } from '../src/decorators';

import * as DI from '../src/di';

const d = Debug('test');


@Service({
  test: 'test'
})
class TestService {

  public static count: number = 0;

  constructor() {
    // d('initing test service')
    TestService.count++;
    d('number of instances', TestService.count);
  }

  @Endpoint({
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



    const service = DI.getSingleton('TestService');

    const serviceDef = (service as any)[EndpointSymbol];
    const endpointsDef = (service as any)[LambdaSymbol];

    expect(serviceDef).to.be.eql({ test: 'test'}, 'should match provided config');

    expect(endpointsDef).to.be.eql([{ functionName: 'testMethod', test: 'test' }]);

  });
});
