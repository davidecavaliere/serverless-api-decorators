import * as Debug from 'debug';

const d = Debug('DI');

const singletons: Object = {};

export const registerSingleton = (target: any) => {
  d('registering singleton:', target);

  const className = target.constructor.name;

  (singletons as any)[className] = new (target as any)();

  d('singletons', singletons);
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
