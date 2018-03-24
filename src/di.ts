import * as Debug from 'debug';

const d = Debug('DI');

const singletons: Object = {};

export const registerSingleton = (target: any) => {
  d('registering singleton:', target);

  const className = target.name;
  d('classname: ', className);

  const serviceName = target.prototype['__service__'].name;

  d('serviceName: ', serviceName);

  // should implement lazy loading
  (singletons as any)[serviceName] = new target();

  d('singletons', singletons);
}

export const getSingleton = (name: string) => {

  d('retrieving singleton:', singletons);

  return (singletons as any)[name];

}

export const getServices = () => {
  return singletons;
}


// export class DIManager {
//
//   private singletons: Object = {};
//
//   constructor() {
//
//   }
//
//   public registrer(singleton: any) {
//     d('registering singleton:', singleton);
//     // this.singletons[singleton.constructor.name] = new singleton();
//   }
//
// }
