import index = require('../src/index');
import * as chai from 'chai';
import * as mocha from 'mocha';

import * as Debug from 'debug';
import { Endpoint, Lambda, EndpointSymbol, LambdaSymbol } from '../src/decorators';


const d = Debug('test');

@Endpoint({
  test: 'test'
})
class TestService {
  constructor() {
    // d('initing test service')
  }

  @Lambda({
    test: 'test'
  })
  public testMethod() {
    d('running testMethod', this);
  }
}



const expect = chai.expect;

describe('decorators', () => {
  it('should inject configuration into instance', () => {


    // d('serverless plugin', index);
    const service = new TestService();

    const serviceDef = (service as any)[EndpointSymbol];
    const endpointsDef = (service as any)[LambdaSymbol];

    expect(serviceDef).to.be.eql({ test: 'test'}, 'should match provided config');

    expect(endpointsDef).to.be.eql([{ functionName: 'testMethod', test: 'test' }]);

  });
});
