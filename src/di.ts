import * as Debug from 'debug';

const d = Debug('DI');

const singletons: Object = {};

export const registerSingleton = (target: any) => {
  d('registering singleton:', target);

  const className = target.name;
  d('classname: ', className);


  (singletons as any)[className] = new target();

  d('singletons', singletons);
}

export const getSingleton = (name: string) => {

  d('retrieving singleton:', singletons);

  return (singletons as any)[name];

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
