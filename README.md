# mi2js

A JS library, materializing slowly, trying to stay small.

## Guidelines
These are guiding thoughts when adding, removing, changing the functionalities
 - create small and useful core
 - keep core
  - as simple as possible 
  - as short as possible
  - as independent as possible
 - remove features from the core that are not essential
  - aim for less code in library
  - ask: will I ever need this really ?
  - ask: can it be a separate addon ?
  - ask: will most projects need it ?
 - simpler code will likely have less bugs :)
 - help code using the utilities be simple and readable

## Code
 - minimizer friendly 
 - avoid too short variable names ( I tend to break this one often :D ) 
 - keep code in JS files, no coding in template (error handling becomes tedious)
 - provide means to easily pinpoint error source (not just stack trace)

## Browsers
Personally, I do not care about any browser without Flexbox support ( Flexbox not actually required by the library )
 - Issues mostly easily fixable by polyfills
 - __PhantomJS__ - polyfill for Function.bind is used
  - when printing HTML->PDF
  - testing using Karma
 - __Chrome__
 - __Firefox__ 
 - Fuck __IE__ < 11 
   - if it actually works on some old IE, zero F...s given
   - no plans to pollute library code for old browser support 
 - Likely culprits for browser problems
  - Function.bind - known issue in PhantomJS
  - Object.create
  - Element.firstElementChild - same as nextElementSibling, previousElementSibling 
