import {logicAspect}  from '../../tooling/ModuleUnderTest';

describe('logicAspect() tests', () => {

  test('name', () => {
    expect( logicAspect.name)
      .toEqual('logic');
  });

});
