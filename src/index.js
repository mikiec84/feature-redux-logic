import logicAspect  from './logicAspect';

//*** 
//*** Promote all feature-redux-logic utilities through a centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { createFeature }    from 'feature-redux-logic';
//       -or-
//         import * as FeatureU from 'feature-redux-logic';
export {
  logicAspect,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { createFeature } = require('feature-redux-logic');
//       -or-
//         const FeatureU   = require('feature-redux-logic');
export default {
  logicAspect,
};
