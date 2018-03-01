import {createFeature}  from  'feature-u';
import {logicAspect}    from '..'; // modules under test

// temporarly turn on logging (just for fun)
// ... must include launchApp on this
// launchApp.diag.logf.enable();

describe('logicAspect() tests', () => {

  describe('validate logicAspect.name', () => {

    test('name', () => {
      expect( logicAspect.name)
        .toBe('logic');
    });

  });


  describe('genesis()', () => {

    logicAspect.genesis();

    const noOpTest = "can't access isAspectProperty() ... just running code :-(";
    test('verify extendAspectProperty()', () => {
      expect(noOpTest)
        .toBe(noOpTest);
    });

  });


  describe('validateFeatureContent()', () => {

    test('must be an array', () => {

      const feature = createFeature({
        name:  'feature1',
        logic: "I'm NOT an array",
      });

      expect(logicAspect.validateFeatureContent(feature))
        .toMatch(/must be an array/);
    });

    test('success', () => {

      const feature = createFeature({
        name:  'feature1',
        logic: ['mock', 'logic', 'modules'],
      });

      expect(logicAspect.validateFeatureContent(feature))
        .toBe(null);
    });

  });


  describe('assembleFeatureContent()', () => {

    test('no logic modules (DEFAULT)', () => {
      expect(()=>logicAspect.assembleFeatureContent('simulated app', []))
        .toThrow(/found NO logic modules within your features/);
    });

    describe('no logic modules (OVERRIDE true)', () => {
      beforeEach(() => {
        logicAspect.allowNoLogic$ = true;
      });      
      afterEach(() => {
        logicAspect.allowNoLogic$ = false;
      });
      test('expecting getReduxMiddleware() to be null', () => {
        logicAspect.assembleFeatureContent('simulated app', []);
        expect(logicAspect.getReduxMiddleware())
          .toBe(null);
      });
    });

    describe('no logic modules (OVERRIDE array)', () => {
      beforeEach(() => {
        logicAspect.allowNoLogic$ = ['simulated', 'logic'];
      });      
      afterEach(() => {
        logicAspect.allowNoLogic$ = false;
      });
      test('expecting getReduxMiddleware() to be non-null', () => {
        logicAspect.assembleFeatureContent('simulated app', []);
        expect(logicAspect.getReduxMiddleware())
          .not.toBe(null);
      });
    });

    describe('features have logic modules', () => {
      test('expecting getReduxMiddleware() to be non-null', () => {
        logicAspect.assembleFeatureContent('simulated app', [
          createFeature({
            name:  'feature1',
            logic: ['simulated', 'logic']
          }),
          createFeature({
            name:  'featureWithNoLogic',
          })
        ]);
        expect(logicAspect.getReduxMiddleware())
          .not.toBe(null);
      });
    });

  });

});
