import index = require('../src/models');
import * as chai from 'chai';
import * as mocha from 'mocha';

import * as Debug from 'debug';
import { Entity, Field, Factory } from '../src/models';

import * as DI from '../src/di';

const d = Debug('test');


@Entity({
  table: 'Users',
  storage: 'DynamoDB'
})
export class User {

  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public email: string;


  constructor() {

  }
}


const expect = chai.expect;

describe('index', () => {
  it('should create a factory', () => {

    d('DI:', DI);




  });
});
