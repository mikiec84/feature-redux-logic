import {logicAspect}  from '..'; // STOP USING: '../../tooling/ModuleUnderTest';

describe('logicAspect() tests', () => {

  test('name', () => {
    expect( logicAspect.name)
      .toEqual('logic');
  });

});
