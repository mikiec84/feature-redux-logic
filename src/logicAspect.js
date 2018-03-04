import {createLogicMiddleware} from 'redux-logic';  // peerDependency
import {createAspect,
        launchApp}             from 'feature-u';    // peerDependency:

// our logger (integrated/activated via feature-u)
const logf = launchApp.diag.logf.newLogger('- ***feature-redux-logic*** logicAspect: ');

// NOTE: See README for complete description
export default createAspect({
  name: 'logic',
  validateFeatureContent,
  assembleFeatureContent,
  getReduxMiddleware,
  config: {
    allowNoLogic$: false,   // PUBLIC: client override to: true || [{logicModules}]
    createLogicMiddleware$, // HIDDEN: createLogicMiddleware$(app, appLogic): reduxMiddleware
  },
});


/**
 * Validate self's aspect content on supplied feature.
 *
 * NOTE: To better understand the context in which any returned
 *       validation messages are used, **feature-u** will prefix them
 *       with: 'createFeature() parameter violation: '
 *
 * @param {Feature} feature - the feature to validate, which is known
 * to contain this aspect.
 *
 * @return {string} an error message when the supplied feature
 * contains invalid content for this aspect (null when valid).
 *
 * @private
 */
function validateFeatureContent(feature) {
  const content = feature[this.name];
  return Array.isArray(content)
          ? null
          : `${this.name} (when supplied) must be an array of redux-logic modules`;
}


/**
 * Interpret the supplied features, defining our redux middleware 
 * in support of reduc-logic.
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @private
 */
function assembleFeatureContent(app, activeFeatures) {

  // accumulate logic modules across all features
  const hookSummary = [];
  let   appLogic = activeFeatures.reduce( (accum, feature) => {
    if (feature[this.name]) {
      accum = [...accum, ...feature[this.name]];
      hookSummary.push(`\n  Feature.name:${feature.name} <-- promotes ${this.name} AspectContent`);
    }
    else {
      hookSummary.push(`\n  Feature.name:${feature.name}`);
    }
    return accum;
  }, []);


  // report the accumulation of logic modules
  if (appLogic.length > 0) {
    logf(`assembleFeatureContent() gathered logic modules from the following Features: ${hookSummary}`);
  }

  // handle special case where NO logic modules were gathered from features
  else {

    // by default, this is an error condition (when NOT overridden by client)
    if (!this.config.allowNoLogic$) {
      throw new Error('***ERROR*** feature-redux-logic found NO logic modules within your features ' +
                      `... did you forget to register Feature.${this.name} aspects in your features? ` +
                      '(please refer to the feature-redux-logic docs to see how to override this behavior).');
    }

    // when client override is an array, interpret it as logic modules
    if (Array.isArray(this.config.allowNoLogic$)) {
      logf.force('WARNING: NO logic modules were found in your Features (i.e. Feature.${this.name}), ' +
                 'but client override (logicAspect.config.allowNoLogic$=[{logicModules}];) ' +
                 'directed a continuation WITH specified logic modules.');
      appLogic = this.config.allowNoLogic$;
    }
    // otherwise, we simply disable redux-logic and continue on
    else {
      logf.force('WARNING: NO logic modules were found in your Features, ' +
                 'but client override (logicAspect.config.allowNoLogic$=truthy;) ' +
                 'directed a continuation WITHOUT redux-logic.');
    }
  }

  // define our redux middleware for redux-logic
  // ... conditionally when we have logic modules
  // ... retained in self for promotion to feature-redux plugin
  if (appLogic.length > 0) {
    // ... accomplished in internal config micro function (a defensive measure to allow easier overriding by client)
    this.logicMiddleware = this.config.createLogicMiddleware$(app, appLogic);
  }
  // if we have no logic ... we have no middleware
  else {
    this.logicMiddleware = null;
  }
}


/**
 * An internal config micro function that creates/returns the
 * redux middleware for redux-logic.
 *
 * This logic is broken out in this internal method as a defensive
 * measure to make it easier for a client to override (if needed for
 * some unknown reason).
 *
 * @param {App} app the App object used in feature
 * cross-communication.  This must be dependancy injected into
 * redux-logic.
 *
 * @param {logicModuls[]} appLogicArr - an array of redux-logic
 * modules (gaurenteed to have at least one entry).
 *
 * @return {reduxMiddleware} the newly created redux middleware for
 * redux-logic.
 *
 * @private
 */
function createLogicMiddleware$(app, appLogic) {
  // define our redux middleware for redux-logic
  return createLogicMiddleware(appLogic,
                               { // inject our app as a redux-logic dependancy
                                 app,
                               });
}


/**
 * Expose our redux middleware that activates redux-logic.  
 *
 * This method is consumed by the feature-redux Aspect using an
 * "aspect cross-communication".
 *
 * @private
 */
function getReduxMiddleware() {
  return this.logicMiddleware;
}
