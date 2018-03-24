import 'reflect-metadata';
import * as D from 'debug';

const d = D('test');

const ClassMetadata = Symbol('ClassMetadata');

function ClassDecoratorFactory(options: any) {
  d('running ClassDecoratorFactory', options);
  return function ClassDecorator(target: any) {
    d('running ClassDecorator on:', target.constructor.name);
    Reflect.metadata(ClassMetadata, options)(target);
    d('class metadata are', Reflect.getMetadata(ClassMetadata, target));
  }
}


const PropertyMetadata = Symbol('PropertyMetadata');

function PropertyDecoratorFactory(options: any) {
  d('running PropertyDecoratorFactory', options);
  return function PropertyDecorator(target: any, key: string) {
    const proto = Object.getPrototypeOf(target);
    d('running PropertyDecorator on:', target.constructor.name);
    let metadata = Reflect.getMetadata(PropertyMetadata, proto);

    if (!metadata) {
      metadata = [];
    }

    metadata = metadata.concat(options);

    Reflect.metadata(PropertyMetadata, metadata)(proto);
    d('property metadata are', Reflect.getMetadata(PropertyMetadata, proto));
  }
}

const MethodMetadata = Symbol('MethodMetadata');

function MethodDecoratorFactory(options: any) {
  d('running MethodDecoratorFactory', options);
  return function MethodDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
    const proto = Object.getPrototypeOf(target);
    d('running MethodDecorator on:', target.constructor.name);
    let metadata = Reflect.getMetadata(MethodMetadata, proto);

    if (!metadata) {
      metadata = [];
    }

    metadata = metadata.concat(options);

    Reflect.metadata(MethodMetadata, metadata)(proto);
    d('Method metadata are', Reflect.getMetadata(MethodMetadata, proto));
  }
}


describe('di system', () => {

  @ClassDecoratorFactory({
    a: ['vb'],
    b: (...args: any[]) => {
      console.log('this is a function in an annotation', args, this);
    }
  })
  class TestClass {

    @PropertyDecoratorFactory({
      some: 'some'
    })
    private myProperty: string;


    @PropertyDecoratorFactory({
      other: 'other'
    })
    private otherProperty: string;

    constructor() {
      const proto = Object.getPrototypeOf(this);
      const options = Reflect.getMetadata(ClassMetadata, this.constructor);
      d('initing TestClass', proto);

      const metaKeys = Reflect.getMetadataKeys(this.constructor);
      d('metadata symbols: ', metaKeys);

      for (const key of metaKeys) {
        d(key, Reflect.getMetadata(key, this.constructor));
      }

      d('class metadata: ', Reflect.getMetadata(ClassMetadata, this.constructor));

      d('Properties metadata: ', Reflect.getMetadata(PropertyMetadata, this.constructor));
      d('Methods metadata: ', Reflect.getMetadata(MethodMetadata, this.constructor));


      const metaFunction = options['b'];
      metaFunction.apply(this, ['test', 'my']);
    }

    @MethodDecoratorFactory({
      method: 'descriptionA'
    })
    public methodA(arg1: any, arg2: any) {
      d('calling methodA');
    }

    @MethodDecoratorFactory({
      method: 'descriptionB'
    })
    public methodB(arg1: any, arg2: any) {
      d('calling methodB');
    }

  }

  describe('metadata playground', () => {

    let instance: TestClass = new TestClass();;

    beforeEach(() => {
      // instance
    });

    it('should do something', () => {
      // expect(true).toBe(true);
    });
  });

})
