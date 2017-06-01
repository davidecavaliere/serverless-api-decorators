
import index = require("../src/index");
import * as chai from "chai";

import * as Debug  from 'debug';
import { Service, Endpoint, ServiceSym } from '../src/decorators';

import * as Reflect from 'reflect-metadata';

const d = Debug('test');


@Service({
  test: 'test'
})
class TestService {
  constructor() {
    d('initing test service')
  }
}



const expect = chai.expect;

describe("index", () => {
  it("should provide Greeter", () => {


    const service = new TestService();



    // d('Service', (service as any)[ServiceSym]);



    expect(index).to.not.be.undefined;
  });
});
