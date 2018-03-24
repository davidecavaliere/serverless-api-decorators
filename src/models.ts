import * as Debug from 'debug';
import 'reflect-metadata';

const $log = Debug('models');
export const EntityMetadataDecorator = Symbol('Entity');


export const Entity = (options: any) => {

  $log('running Entity decorator:', options);

  return (target: any) => {
    $log('applying Entity decorator:', target);
    Reflect.metadata(EntityMetadataDecorator, options)(target);
    $log(`${target.constructor.name} metadata:`, Reflect.getMetadata(EntityMetadataDecorator, target));


  }
}

export const Field = (target?: any) => {
  $log('running Field decorator:', target);

  return (...args: any[]) => {
    $log('applying Field decorator:', args);


  }
}

export const Method = (target?: any) => {
  $log('running Method decorator:', target);

  return (...args: any[]) => {
    $log('applying Method decorator:', args);


  }
}
