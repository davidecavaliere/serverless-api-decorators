import { Entity, Field } from 'sls-api-decorators/lib/models';
import * as Debug from 'debug'
const $log = console.log;

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


  constructor() { }
}
