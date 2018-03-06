# feature-redux-logic (feature-u redux-logic integration)

**feature-redux-logic** is your [feature-u] integration point to
[redux-logic]!  It promotes the [`logicAspect`] _(a [feature-u]
plugin)_ that facilitates [redux-logic] integration to your features.

**Backdrop:**

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

[feature-u] is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your
project by individual features.  [feature-u] is extendable. It
operates under an open plugin architecture where Aspects integrate
**feature-u** to other framework/utilities that match your specific
run-time stack.

</ul>


<!--- Badges for CI Builds ---> 
[![Build Status](https://travis-ci.org/KevinAst/feature-redux-logic.svg?branch=master)](https://travis-ci.org/KevinAst/feature-redux-logic)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/81530601c0f2449481882ac285add698)](https://www.codacy.com/app/KevinAst/feature-redux-logic?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=KevinAst/feature-redux-logic&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/81530601c0f2449481882ac285add698)](https://www.codacy.com/app/KevinAst/feature-redux-logic?utm_source=github.com&utm_medium=referral&utm_content=KevinAst/feature-redux-logic&utm_campaign=Badge_Coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/kevinast/feature-redux-logic/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kevinast/feature-redux-logic?targetFile=package.json)
[![NPM Version Badge](https://img.shields.io/npm/v/feature-redux-logic.svg)](https://www.npmjs.com/package/feature-redux-logic)


**Overview:**

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

**feature-redux-logic** configures [redux-logic] through the [`logicAspect`]
(_which is supplied to_ **feature-u**'s [`launchApp()`]).  This
extends **feature-u**'s [`Feature`] object by adding support for the
`Feature.logic` property, referencing an array of feature-based logic modules.

It is important to understand that you continue to use [redux-logic] the
same way you always have.  It's just that now you are dealing with a
**smaller context** ... _within the boundaries of your feature_!

</ul>

Let's see how this all works together ...

## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  - [Single Source of Truth](#single-source-of-truth)
  - [Why redux-logic?](#why-redux-logic)
- [Interface Points](#interface-points)
  - [Input](#input)
  - [Exposure](#exposure)
  - [Error Conditions](#error-conditions)
- [API](#api)
  - [`logicAspect: Aspect`](#logicaspect-aspect)



## Install

- **peerDependencies** ... you should already have these, **because
  this is our integration point** _(but just in case)_:

  ```shell
  npm install --save feature-u
  npm install --save redux-logic
  ```
  <!--- WITH REVEAL of USAGE:
  npm install --save feature-u    # VER: >=0.1.0    USAGE: createAspect()
  npm install --save redux-logic  # VER: >=0.7.0    USAGE: createLogicMiddleware()
  ---> 

- **the main event**:

  ```shell
  npm install --save feature-redux-logic
  ```


## Usage

1. Within your mainline, register the **feature-redux-logic**
   [`logicAspect`] to **feature-u**'s [`launchApp()`] _(see: `**1**`
   below)_.

   **Please Note**: [redux] must also be present in your run-time
   stack, because [redux-logic] is a middleware agent of [redux]
   _(see: `**2**` below)_.

   **src/app.js**
   ```js
   import {launchApp}      from 'feature-u';
   import {reducerAspect}  from 'feature-redux';       // **2**
   import {logicAspect}    from 'feature-redux-logic'; // **1**
   import features         from './feature';

   export default launchApp({

     aspects: [
       reducerAspect,  // **2**
       logicAspect,    // **1**
       ... other Aspects here
     ],

     features,

     registerRootAppElm(rootAppElm) {
       ReactDOM.render(rootAppElm,
                       getElementById('myAppRoot'));
     }
   });
   ```

2. Within each feature that maintains logic, simply register the
   feature's logic modules through the `Feature.logic` property
   _(using **feature-u**'s [`createFeature()`])_ ... _see: `**3**`
   below_.

   **src/feature/myXyzFeature/index.js**
   ```js
   import {createFeature}  from 'feature-u';
   import logic            from './logic';
   
   export default createFeature({

     name:     'myXyzFeature',

     logic,  // **3** myXyzFeature logic[]

     ... snip snip (other aspect properties here)
   });
   ```


**Well that was easy!!** At this point **redux-logic** is **completely
setup for your application!**

In the nutshell, that's a highlight of most everything you need to
know to use **feature-redux-logic**!  _Go forth and compute!_


## A Closer Look

Any feature that maintains business logic promotes it's own set of
logic modules through the `Feature.logic` property _(using
**feature-u**'s [`createFeature()`])_.  While these logic modules are
truly opaque assets _(internal to the feature)_, they are of interest
to **feature-redux-logic** to the extent that they are needed to configure
[redux-logic].

Because logic modules may require access to **feature-u**'s [`App`]
object during code expansion, this property can also be a
**feature-u** [`managedExpansion()`] callback _(a function that
returns the logic modules)_ ... please refer to **feature-u**'s
discussion of [Managed Code Expansion].

It is important to understand that your interface to [redux-logic] has not
changed in any way.  In other words, you continue to use [redux-logic] the
same way you always have.  It's just that now you are dealing with a
**smaller context** ... _within the boundaries of your feature_!

As always, you should strive to keep each feature isolated, so it is
truly **plug-and-play**.


### Single Source of Truth

The featureName (i.e. `Feature.name`) is a critical item that can be
used throughout your feature implementation to promote a consistent
feature identity.

A key aspect of the featureName is that [feature-u] guarantees it's
uniqueness.  As a result, it can be used to qualify the identity of
several feature aspects.

A **best practice** in consideration of feature-based logic modules,
is to prefix all logic module names with featureName.  While this is
not required, it helps (in diagnostic logs) to identify where that
module lives.

Here is an example _(see: `**4**`)_:

**src/feature/myXyzFeature/logic/doSomething.js**
```js
import {createLogic}      from 'redux-logic';
import featureName        from './featureName';
import actions            from './actions';

export const doSomething = createLogic({

  name: `${featureName}.doSomething`, // **4**
  type: String(actions.some.action),

  transform({getState, action}, next, reject) {
    ... snip snip
  },

  process({getState, action, app}, dispatch, done) {
    ... snip snip
  }

});
```

### Why redux-logic?

There are many ways to introduce logic in your [react] app.  This
article breaks down the various options: **_[Where do I put my
business logic in a React-Redux
application?](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1)_**
The article is an introduction (and motivation) for the development of
**_[redux-logic]_** ... *redux middleware for organizing all your
business logic*.

I have been using [redux-logic] since it's inception and believe it is
the _**best approach to encapsulate your business logic**_. Prior to
redux-logic, my business logic was spread out in a variety of
different places, including:

- component methods
- thunks
- and various middleware components

In addition, I relied heavily on batched actions, where logic entry
points would stimulate multiple actions in one procedural chunk of
code.  Needless to say, this was less than ideal. Even tools like
redux-dev-tools could not give me adequate insight into "what was
stimulating what"!

All of these techniques were replaced with "true" business logic,
organizing all my logic in one isolated spot, all orchestrated by
[redux-logic]!

My business logic is now:

- located in one logical discipline (i.e. dedicated "logic" modules)
- making it testable in isolation (very nice)!!
- has more concise and succinct goals
- promotes modular reuse
- provides traceable "cause and effects"
- is greatly simplified!


## Interface Points

**feature-redux-logic** accumulates all the logic modules from the
various features of your app, and registers them to [redux-logic].  This
is accomplished by creating the [redux middleware] which
is in turn registered to [redux].  The **Aspect Interface** to this
process (_i.e. the inputs and outputs_) are documented here.


### Input

- The input to **feature-redux-logic** are [redux-logic] modules.
  This is specified by each of your features (_that maintain logic_)
  through the `Feature.logic` property, containing a logic modules
  array.


### Exposure

- The output from **feature-redux-logic** is the [redux middleware]
  component, exposed through the `Aspect.getReduxMiddleware()` API
  (an "aspect cross-communication mechanism").  This middleware
  component must be consumed by yet another aspect (_such as
  [feature-redux]_) that in turn manages [redux].


### Error Conditions

When **feature-redux-logic** detects that no logic modules have been
specified by any of your features, it will (by default) throw the
following exception:

```
***ERROR*** feature-redux-logic found NO logic modules within your features
            ... did you forget to register Feature.logic aspects in your features?
            (please refer to the feature-redux-logic docs to see how to override this behavior).
```

Most likely this should in fact be considered an error _(for example
you neglected to specify the logic modules within your features)_.  **The
reasoning is**: _why would you not specify any logic modules if
your using redux-logic?_

You can change this behavior through the following configuration:

```js
logicAspect.config.allowNoLogic$ = true;
```

With this option enabled, when no logic modules are found,
redux-logic will simply NOT be configured (accompanied with a WARNING
logging probe).

You can also specify your own array of logic modules in place of the
`true` value, which will be used ONLY in the scenario where no logic
modules were specified by your features.



## API

### logicAspect: Aspect

<ul><!--- indentation hack for github - other attempts with style is stripped (be careful with number bullets) ---> 

The `logicAspect` is the [feature-u] plugin that facilitates
[redux-logic] integration to your features.

To use this aspect:

- Within your mainline, register the **feature-redux-logic**
  `logicAspect` to **feature-u**'s [`launchApp()`].

- Within each feature that maintains business logic, simply register
  the feature's logic modules through the `Feature.logic` property
  _(using **feature-u**'s [`createFeature()`])_.

Please refer to the [Usage] section for examples of this process.

</ul>




<!--- *** REFERENCE LINKS *** ---> 

<!--- **feature-redux-logic** ---> 
[Usage]:          #usage
[`logicAspect`]:  #logicaspect-aspect

<!--- **feature-redux** ---> 
[feature-redux]:          https://github.com/KevinAst/feature-redux


<!--- feature-u ---> 
[feature-u]:              https://feature-u.js.org/
[`launchApp()`]:          https://feature-u.js.org/cur/api.html#launchApp
[`createFeature()`]:      https://feature-u.js.org/cur/api.html#createFeature
[`managedExpansion()`]:   https://feature-u.js.org/cur/api.html#managedExpansion
[publicFace]:             https://feature-u.js.org/cur/crossCommunication.html#publicface-and-the-app-object
[`Feature`]:              https://feature-u.js.org/cur/api.html#Feature
[`App`]:                  https://feature-u.js.org/cur/api.html#App
[Managed Code Expansion]: https://feature-u.js.org/cur/crossCommunication.html#managed-code-expansion

<!--- react ---> 
[react]:            https://reactjs.org/


<!--- redux ---> 
[redux]:            https://redux.js.org/
[redux middleware]: https://redux.js.org/docs/advanced/Middleware.html

<!--- redux-logic ---> 
[redux-logic]:      https://github.com/jeffbski/redux-logic

<!--- 3rd party action managers ---> 
